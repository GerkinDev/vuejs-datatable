import { promises, readdirSync, statSync } from 'fs';
const { readFile, writeFile } = promises;
import chalk from 'chalk';
// tslint:disable-next-line: no-implicit-dependencies
import { ensureDirSync } from 'fs-extra';
import { join, resolve } from 'path';

import { rewriteBaseVueApp } from './build-utils';
import { rollupize } from './rollupize';

const tutorialSourcesDir = resolve( __dirname, '../src' );
const tutorialOutDir = resolve( __dirname, '../dist' );

const dirs = readdirSync( tutorialSourcesDir )
	// Only dirs
	.filter( file => {
		const stat = statSync( join( tutorialSourcesDir, file ) );
		return stat.isDirectory();
	} );

// tslint:disable-next-line: no-console
const printDelimiter = () => console.log( chalk.bold( '--------------------' ) );

const allOperations = dirs.map( ( dir, index ) => async () => {
	if ( index !== 0 ) {
		printDelimiter();
	}
	const startDate = Date.now();
	// tslint:disable-next-line: no-console
	console.log( `Starting build of tutorial "${chalk.green( dir )}"` );
	const absDir = resolve( tutorialSourcesDir, dir );
	const jsFile = join( absDir, 'demo.ts' );
	const htmlFile = join( absDir, 'index.md' );
	const [ scripts, mdTutoCst ] = await Promise.all( [
		rollupize( jsFile ),
		readFile( htmlFile, 'UTF-8' ) as Promise<string>,
	] );
	let mdTuto = mdTutoCst;

	ensureDirSync( tutorialOutDir );

	const htmlAppCodeMatch = mdTuto.match( /(<div[^>]+id="demo-app".+?<\/div>)(?=\s+## Code)/gms );
	if ( htmlAppCodeMatch && htmlAppCodeMatch.length >= 1 ) {
		const htmlAppCode = htmlAppCodeMatch[0];
		mdTuto = rewriteBaseVueApp( mdTuto, htmlAppCode, dir );
		const toMdCodeBlock = ( type: string, code: string ) =>
			`\`\`\`${ type }\n${ code.replace( /\t/g, '    ' ) }\n\`\`\``;
		mdTuto = mdTuto.replace( '```HTML```', toMdCodeBlock( 'html', htmlAppCode ) );
		if ( scripts ) {
			mdTuto = mdTuto.replace( '```TS```',   toMdCodeBlock( 'ts', scripts.display ) );
		}

		if ( scripts ) {
			try {
				const demoScriptName = `demo-${dir}.js`;

				mdTuto = mdTuto.replace( '<script id="demo-script"></script>', `<script src="{{relativeURLToRoot /assets/js/tutorials/${demoScriptName}}}" defer></script>` );
				await writeFile( resolve( tutorialOutDir, demoScriptName ), scripts.exec, 'UTF-8' );
			} catch ( e ) {
				// tslint:disable-next-line: no-console
				console.warn( `For demo "${ dir }":`, e );
			}
		} else {
			throw new Error();
		}
	}

	mdTuto = mdTuto.replace(
		'<script id="deps"></script>',
		`<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.js" crossorigin="anonymous" defer></script>
<script src="{{relativeURLToRoot /assets/js/vuejs-datatable.js}}" defer></script>
<link rel="stylesheet" href="{{relativeURLToRoot /assets/css/additional-styles.css}}">
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">` );

	await writeFile( resolve( tutorialOutDir, `${ dir }.md` ), mdTuto, 'UTF-8' );
	const deltaTime = ( Date.now() - startDate ) / 1000;
	// tslint:disable-next-line: no-console
	console.log( `Ended build of tutorial "${chalk.green( dir )}" in ${chalk.yellow( deltaTime + 's' )}` );
} );

allOperations.reduce( ( acc, op ) => acc.then( op ), Promise.resolve() ).then( () => {
	printDelimiter();
	// tslint:disable-next-line: no-console
	console.info( 'Tutorials transformed !' );
	process.exit( 0 );
} ).catch( e => {
	// tslint:disable-next-line: no-console
	console.error( 'An error occured while building the docs:', e );
	process.exit( 1 );
} );
