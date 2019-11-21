
import { execSync } from 'child_process';
// tslint:disable-next-line: no-implicit-dependencies
import { prerelease } from 'semver';

import { IRepoConfig, release, runTests } from './actions';
import { logDebug, logError, logInfo, logStep } from './log';
import { execStream } from './spawn-exec';

// tslint:disable-next-line: no-var-requires
const renovateConfig = require( '../renovate.json' );
// tslint:disable-next-line: no-var-requires
const packageFile = require( '../package.json' );
const currentBranch = process.env.TRAVIS_BRANCH || execSync( "git branch | grep \\* | cut -d ' ' -f2" ).toString().trim();
const lastCommitMessage = execSync( 'git show -s --format=%B' ).toString().trim();
const repoConf: IRepoConfig = {
	gitUser: {
		email: 'travis@travis-ci.org',
		name: 'Travis CI',
	},
	repoUrl: packageFile.repository.url,
};
const committer = execSync( "git show -s --format='%ae'" ).toString().trim();

const main = async () => {
	const actions: Array<{label: string; genFn: () => Promise<void>}> = [];

	actions.push( {
		genFn: async () => {
			if ( !await runTests() ) {
				logError( 'Stopping here since tests failed.' );
				process.exit( 1 );
			}
		},
		label: 'Running tests',
	} );

	actions.push( {
		genFn: async () => {
			if ( committer === repoConf.gitUser.email ) {
				logInfo( 'Travis CI did the last commit. Abort.' );
				process.exit( 0 );
			}
		},
		label: 'Check if previous committer is Travis CI',
	} );

	if ( currentBranch === 'staging' && process.env.CC_SAMPLE === 'true' ) {
		const messageWithCurrentTag = packageFile['standard-version'].releaseCommitMessageFormat.replace( '{{previousTag}}', packageFile.version );
		if ( lastCommitMessage.startsWith( renovateConfig.commitMessagePrefix ) ) {
			actions.push( {
				genFn: async () => {
					await execStream( 'git checkout staging' );

					// Bump version
					const prereleaseSegments = prerelease( packageFile.version );
					await release( repoConf, 'chore: 🤖 Applying renovate update', messageWithCurrentTag, prereleaseSegments ? prereleaseSegments[0] : undefined );
				},
				label: 'Handling renovate update',
			} );

		} else {
			const matchPrerelease = lastCommitMessage.match( /^chore: 🤖 Prepare (\w+) prerelease$/ );
			if ( matchPrerelease ) {
				actions.push( {
					genFn: () => release( repoConf, 'chore: 🤖 Release manual prerelease', messageWithCurrentTag, matchPrerelease[1] ),
					label: 'Handling prerelease',
				} );

			} else if ( lastCommitMessage === 'chore: 🤖 Prepare release' ) {
				actions.push( {
					genFn: () => release( repoConf, 'chore: 🤖 Release manual release', messageWithCurrentTag ),
					label: 'Handling release',
				} );
			} else {
				actions.push( {
					genFn: async () => {
						logDebug( 'Had following infos: ' + JSON.stringify( { lastCommitMessage, renovateConfig } ) );
					},
					label: 'No deploy action to do. Finished',
				} );
			}
		}
	} else {
		actions.push( {
			genFn: async () => {
				logDebug( 'Had following infos: ' + JSON.stringify( { currentBranch, CC_SAMPLE: process.env.CC_SAMPLE } ) );
			},
			label: 'No deploy action to do. Finished',
		} );
	}

	for ( const { label, genFn } of actions ) {
		logStep( label );
		await genFn();
	}
};

main()
	.catch( e => {
		// tslint:disable-next-line: no-console
		console.error( e );
		process.exit( ( e as any ).code || 1 );
	} );
