import { ChildProcess, exec, execSync, spawn } from 'child_process';
// tslint:disable-next-line: no-implicit-dependencies
import { readFile, writeFile } from 'fs-extra';
import { homedir } from 'os';
import { resolve } from 'path';
// tslint:disable-next-line: no-implicit-dependencies
import { prerelease } from 'semver';

const loggableData = ( buffer: Buffer ) => buffer.toString().replace( /\r?\n$/, '' );
const formatOutputText = ( prefix: string, data: string ) => {
	const padLeft = prefix.replace( /.(?!$)/g, ' ' ).replace( /.$/g, '|' ) + ' ';
	return `${prefix} ${data.replace( /\r?\n/g, '\n' + padLeft )}`;
};
const spawnStream = async ( cmd: string, args: string[], attachOuts?: boolean ) => {
	const prefix = `${cmd} ${args.join( ' ' )}`;
	const cmdProcess = spawn( cmd, args );
	return streamChildProcess( cmdProcess, prefix, attachOuts );
};
const execStream = async ( cmd: string, attachOuts?: boolean ) => {
	const cmdProcess = exec( cmd );
	return streamChildProcess( cmdProcess, cmd, attachOuts );
};
const streamChildProcess = async ( child: ChildProcess, logPrefix: string, attachOuts = false ) => new Promise<void>( ( res, rej ) => {
	if ( attachOuts ) {
		if ( child.stdout ) {
			child.stdout.on( 'data', data => {
				// tslint:disable-next-line: no-console
				console.log( formatOutputText( `"${logPrefix}" stdout:`, loggableData( data ) ) );
			} );
		}

		if ( child.stderr ) {
			child.stderr.on( 'data', data => {
				// tslint:disable-next-line: no-console
				console.error( formatOutputText( `"${logPrefix}" stderr:`, loggableData( data ) ) );
			} );
		}

		child.on( 'exit', code => {
			if ( code === 0 ) {
				return res();
			} else {
				// Create the error
				const err = new Error( `Child process exited with code ${code}` );
				( err as any ).code = code;
				return rej( err );
			}
		} );
	} else {
		let stdout = '';
		let stderr = '';
		if ( child.stdout ) {
			child.stdout.on( 'data', data => {
				stdout += '\n' + loggableData( data );
			} );
		}

		if ( child.stderr ) {
			child.stderr.on( 'data', data => {
				stderr += '\n' + loggableData( data );
			} );
		}

		child.on( 'exit', code => {
			if ( code === 0 ) {
				return res();
			} else {
				// Log command outputs for debugging purposes
				// tslint:disable-next-line: no-console
				console.log( formatOutputText( `"${logPrefix}" stdout:`, stdout ) );
				// tslint:disable-next-line: no-console
				console.error( formatOutputText( `"${logPrefix}" stderr:`, stderr ) );

				// Create the error
				const err = new Error( `Child process exited with code ${code}` );
				( err as any ).code = code;
				return rej( err );
			}
		} );
	}

} );

// tslint:disable-next-line: no-var-requires
const renovateConfig = require( '../renovate.json' );
// tslint:disable-next-line: no-var-requires
const packageFile = require( '../package.json' );
const currentBranch = process.env.TRAVIS_BRANCH || execSync( "git branch | grep \\* | cut -d ' ' -f2" ).toString().trim();
const lastCommitMessage = execSync( 'git show -s --format=%B' ).toString().trim();
const travisGit = {
	email: 'travis@travis-ci.org',
	name: 'Travis CI',
};
const skipCi = '\n\n[skip ci]';
const committer = execSync( "git show -s --format='%ae'" ).toString().trim();

const runTests = async () => {
	// tslint:disable-next-line: no-console
	console.log( '==> Running tests' );
	try {
		await spawnStream( 'npm', ['run', 'test'], true );
		return true;
	} catch ( e ) {
		// tslint:disable-next-line: no-console
		console.error( e );
		return false;
	}
};
const publish = async () => {
	// tslint:disable-next-line: no-console
	console.log( '==> Go for publish' );
	// Create the file used by travis to test for publish
	await execStream( 'echo "" >> ~/do-release' );
};
let gitHasBeenSetup = false;
const setupGit = async () => {
	if ( gitHasBeenSetup ) {
		return;
	}
	// tslint:disable-next-line: no-console
	console.log( '==> Setting up git for pushes' );
	gitHasBeenSetup = true;
	const travisPrivateKey = resolve( './travis_key' );
	const travisPrivateKeyEnc = resolve( 'ci/travis_key.enc' );
	const githubKeyPub = resolve( 'ci/github_key.pub' );

	// Decrypt the cert file
	await spawnStream( 'openssl', ['aes-256-cbc', '-k', process.env.GITHUB_PUSH_CERT_PASSWORD || '', '-d', '-md', 'sha256', '-a', '-in', travisPrivateKeyEnc, '-out', travisPrivateKey ] );
	await execStream( `chmod 400 "${travisPrivateKey}"` );
	await execStream( `eval "$(ssh-agent -s)" && ssh-add "${travisPrivateKey}"` );

	await writeFile(
		resolve( homedir(), '.ssh/config' ), `
Host github.com
HostName github.com
User git
IdentityFile ${travisPrivateKey}
IdentitiesOnly yes
`,
		{ flag: 'a' } );

	await writeFile(
		resolve( homedir(), '.ssh/known_hosts' ), `
github.com ${await readFile( githubKeyPub, 'utf-8' )}
`,
		{ flag: 'a' } );

	// Configure git
	await execStream( `git config --global user.email "${travisGit.email}"` );
	await execStream( `git config --global user.name "${travisGit.name}"` );
	// Set the origin so that it uses ssh
	const originUrl = `git@github.com:${packageFile.repository.url.replace( 'https://github.com/', '' )}.git`;
	await execStream( `git remote set-url origin ${originUrl}` );
	// Fetch all branches, not just the current one (default per travis init script)
	await execStream( 'git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"' );
	await execStream( 'git fetch origin' );
};
const resetFile = async ( filepath: string ) => {
	await execStream( `git reset HEAD ${filepath}` );
	try {
		await execStream( `git checkout -- ${filepath}` );
	// tslint:disable-next-line: no-empty
	} catch {}
};
const release = async ( mergeCommitMessage: string, releaseCommitMessage: string, prereleaseMarker?: string ) => {
	await setupGit();

	mergeCommitMessage += skipCi;
	releaseCommitMessage += skipCi;
	const prevCommit = execSync( 'git rev-parse HEAD' ).toString().trim();

	// Switch to master
	await execStream( 'git checkout origin/master --track' );
	await spawnStream( 'git', ['merge', 'origin/staging', '--no-commit', '--no-ff', '-X', 'theirs'] );
	// Bump version
	if ( prereleaseMarker ) {
		// tslint:disable-next-line: no-console
		console.log( `==> Doing a prerelease of kind ${prereleaseMarker}` );
		await spawnStream( 'npm', ['run', 'prerelease', '--', prereleaseMarker, '--releaseCommitMessageFormat', releaseCommitMessage], true );
		await publish();
	} else {
		// tslint:disable-next-line: no-console
		console.log( '==> Doing a release' );
		await spawnStream( 'npm', ['run', 'release', '--releaseCommitMessageFormat', releaseCommitMessage], true );
		await publish();
	}
	// tslint:disable-next-line: no-console
	console.log( `==> ${prereleaseMarker ? 'Prerelease' : 'Release'} built & committed` );
	// Push to master
	await execStream( 'git push --set-upstream origin', true );
	await execStream( 'git push --follow-tags', true );

	// Set master & staging at the same level
	await execStream( 'git checkout staging' );
	// Omit docs
	await execStream( 'git merge master --no-commit --no-ff -X theirs' );
	await resetFile( 'docs' );
	await resetFile( 'dist' );
	await spawnStream( 'git', ['commit', '-m', mergeCommitMessage] );
	// Push to staging
	await execStream( 'git push --set-upstream origin', true );

	// Update develop
	await execStream( 'git checkout origin/develop --track' );
	// Omit docs
	await spawnStream( 'git', ['merge', 'origin/staging', '--no-commit', '--no-ff'] );
	await resetFile( 'docs' );
	await resetFile( 'dist' );
	await spawnStream( 'git', ['commit', '-m', mergeCommitMessage] );
	// Push to develop
	await execStream( 'git push --set-upstream origin', true );

	await execStream( 'git checkout master' );
};
const main = async () => {
	const testsSucceeded = await runTests();
	if ( !testsSucceeded ) {
		// tslint:disable-next-line: no-console
		console.error( 'Stopping here since tests failed.' );
		process.exit( 1 );
	}

	if ( committer === travisGit.email ) {
		// tslint:disable-next-line: no-console
		console.error( '==> Do not re-run since Travis CI did the last commit.' );
		process.exit( 0 );
	}

	if ( currentBranch === 'staging' && process.env.CC_SAMPLE === 'true' ) {
		const messageWithCurrentTag = packageFile['standard-version'].releaseCommitMessageFormat.replace( '{{previousTag}}', packageFile.version );
		if ( renovateConfig.commitMessagePrefix.startsWith( lastCommitMessage ) ) {
			// tslint:disable-next-line: no-console
			console.log( '==> Handling renovate update' );

			await setupGit();

			await execStream( 'git checkout staging' );

			// Bump version
			const prereleaseSegments = prerelease( packageFile.version );
			await release( 'chore: 🤖 Applying renovate update', messageWithCurrentTag, prereleaseSegments ? prereleaseSegments[0] : undefined );
		} else {
			const matchPrerelease = lastCommitMessage.match( /^chore: 🤖 Prepare (\w+) prerelease$/ );
			if ( matchPrerelease ) {
				await release( 'chore: 🤖 Release manual prerelease', messageWithCurrentTag, matchPrerelease[1] );
			} else if ( lastCommitMessage === 'chore: 🤖 Prepare release' ) {
				await release( 'chore: 🤖 Release manual release', messageWithCurrentTag );
			}
		}
	}
};

main()
	.catch( e => {
		// tslint:disable-next-line: no-console
		console.error( e );
		process.exit( ( e as any ).code || 1 );
	} );
