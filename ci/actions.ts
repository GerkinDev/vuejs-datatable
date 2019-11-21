// tslint:disable-next-line: no-implicit-dependencies
import { readFile, writeFile } from 'fs-extra';
import { homedir } from 'os';
import { resolve } from 'path';
import { logDebug, logError, logInfo } from './log';
import { execStream, spawnStream } from './spawn-exec';

export const runTests = async () => {
	logInfo( 'Running tests' );
	try {
		await spawnStream( 'npm', ['run', 'test'], true );
		return true;
	} catch ( e ) {
		logError( e );
		return false;
	}
};

let gitHasBeenSetup = false;
export interface IRepoConfig {
	repoUrl: string;
	gitUser: {email: string; name: string};
}
const setupGit = async ( { repoUrl, gitUser: { email, name }}: IRepoConfig ) => {
	if ( gitHasBeenSetup ) {
		logDebug( 'Git has already been configured.' );
		return;
	}

	logInfo( '==> Setting up git for pushes' );
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
	await execStream( `git config --global user.email "${email}"` );
	await execStream( `git config --global user.name "${name}"` );
	// Set the origin so that it uses ssh
	const matchRepoName = repoUrl.match( /^(?:git\+)?https?:\/\/github\.com\/(.*?)(?:\.git)$/ );
	if ( !matchRepoName ) {
		throw new Error( 'Invalid repository url: did not matched the expected pattern.' );
	}
	const originUrl = `git@github.com:${matchRepoName[1]}.git`;
	await execStream( `git remote set-url origin ${originUrl}` );
	// Fetch all branches, not just the current one (default per travis init script)
	await execStream( 'git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"' );
	await execStream( 'git fetch origin' );
};

// Reset a file to the latest commit state
const resetFile = async ( filepath: string ) => {
	await execStream( `git reset HEAD ${filepath}` );
	try {
		await execStream( `git checkout -- ${filepath}` );
	// tslint:disable-next-line: no-empty
	} catch {}
};

const publish = async () => {
	logInfo( 'Go for publish' );
	// Create the file used by travis to test for publish
	await execStream( 'echo "" >> ~/do-release' );
};

const skipCi = '\n\n[skip ci]';
export const release = async ( repoConf: IRepoConfig, mergeCommitMessage: string, releaseCommitMessage: string, prereleaseMarker?: string ) => {
	await setupGit( repoConf );

	mergeCommitMessage += skipCi;
	releaseCommitMessage += skipCi;

	// Switch to master
	await execStream( 'git checkout origin/master --track' );
	await spawnStream( 'git', ['merge', 'origin/staging', '--no-commit', '--no-ff', '-X', 'theirs'] );
	// Bump version
	if ( prereleaseMarker ) {
		logInfo( `Doing a prerelease of kind ${prereleaseMarker}` );
		await spawnStream( 'npm', ['run', 'prerelease', '--', prereleaseMarker, '--releaseCommitMessageFormat', releaseCommitMessage], true );
		await publish();
	} else {
		logInfo( 'Doing a release' );
		await spawnStream( 'npm', ['run', 'release', '--releaseCommitMessageFormat', releaseCommitMessage], true );
		await publish();
	}
	logDebug( `${prereleaseMarker ? 'Prerelease' : 'Release'} built & committed` );
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
