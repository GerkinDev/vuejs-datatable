// tslint:disable-next-line: no-implicit-dependencies
import jscc from 'jscc';
// tslint:disable-next-line: no-implicit-dependencies
import { memoize } from 'lodash';
import { isAbsolute, resolve } from 'path';
// tslint:disable-next-line: no-implicit-dependencies
import { InputOptions, OutputOptions, rollup } from 'rollup';

import { generateWrappedScript, readFile } from './exec-script-transform';

const buildRollup = async ( input: InputOptions, output: OutputOptions ) => {
	const confBundle = await rollup( input );
	const outBundle = await confBundle.generate( output );
	const { output: [{ code }] } = outBundle;
	return {
		code,
		outBundle,
	};
};
const loadMjsInJs = memoize( async ( filepath: string ) => {
	// See https://github.com/rollup/rollup/blob/master/bin/src/run/loadConfigFile.ts
	const { code } = await buildRollup( {
		external:  id => ( !id.startsWith( '.' ) && !isAbsolute( id ) ) || id.slice( -5, id.length ) === '.json',
		input:     filepath,
		onwarn:    () => ( void( 0 ) ),
		treeshake: false,
	},                                  { format: 'cjs' } );
	const codeWithExports = `let exports = {};${code};exports;`;

	// Swap require for a custom one
	const requireSave = require;
	// @ts-ignore
	require = ( path: string ) => {
		if ( path.startsWith( '.' ) ) {
			return requireSave( resolve( __dirname, '../..', path ) );
		}
		return requireSave( path );
	};
	try {
		// tslint:disable-next-line: no-eval
		return eval( codeWithExports );
	} finally {
		require = requireSave;
	}
} );
const getRollupPlugins = async ( iife = true ) => {
	const rollupOpts = await loadMjsInJs( resolve( __dirname, '../../rollup.config.js' ) );
	const pluginsFactory = rollupOpts.getPlugins;
	return pluginsFactory( iife, 'demo' );
};

export const rollupize = async ( sourceFile: string ) => {
	// Wrap scripts for single execution
	const execFile = await generateWrappedScript( sourceFile );

	try {
		// generate code
		const { code: outCodeDisplay } = jscc( await readFile( sourceFile ), sourceFile, { values: { _DISPLAY: '1' }} );
		const { code: outCodeExec } = await buildRollup( {
			external: [ 'vuejs-datatable', 'axios', 'lodash', 'vue' ],
			input:    execFile,
			plugins:  await getRollupPlugins( true ),
		},                                               {
			format: 'iife',
			globals: {
				'axios': 'axios',
				'lodash': '_',
				'vue': 'Vue',
				'vuejs-datatable': 'VuejsDatatable',
			},
		} );

		return {
			display: outCodeDisplay,
			exec:    outCodeExec,
		};
	} catch ( e ) {
		// tslint:disable-next-line: no-console
		console.error( `An error occured in the transformation of ${ sourceFile }:`, e );
		throw e;
	} finally {
		// await unlink( tempFile );
	}
};
