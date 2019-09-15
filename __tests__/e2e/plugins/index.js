const { writeFile: _writeFile, access } = require( 'fs' );
const { dirname, resolve: resolvePath } = require( 'path' );
const { exec } = require( 'child_process' );
const mkdirp = require( 'mkdirp' );
const { F_OK } = require( 'constants' );

const { rollup } = require( 'rollup' );
const typescript = require( 'rollup-plugin-typescript2' );
const resolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );
const replace = require( 'rollup-plugin-replace' );

const writeFile = ( path, data, opts ) => new Promise( ( res, rej ) => _writeFile( path, data, opts, err => err ? rej( err ) : res() ) );
const mkdir = ( path, opts ) => new Promise( ( res, rej ) => mkdirp( path, opts, err => err ? rej( err ) : res() ) );

module.exports = on => {
	// Trigger build if the module is not already built
	on( 'before:browser:launch', () => {
		return new Promise( ( res, rej ) => {
			access( resolvePath( '../../../dist/vuejs-datatable.js' ), F_OK, err => {
				if ( err ) {
					console.log( 'Missing built library, build it on-the-fly.' );
					exec( 'npm run build', err2 => {
						if ( err2 ) {
							console.error( 'Build failed !' );
							return rej( err2 );
						} else {
							console.info( 'Build succeeded !' );
							return res();
						}
					} );
				} else {
					return res();
				}
			} );
		});
	}),
	on( 'file:preprocessor', async file => {
		const confBundle = await rollup( {
			input: file.filePath,
			plugins: [
				typescript( {
					objectHashIgnoreUnknownHack: true,
					clean: true,//environment === 'production',
					tsconfigOverride: require('../tsconfig.json')
				} ),
				resolve( {
					extensions: [ '.ts', '.js', '.json' ],
					browser: true,
				} ),
				commonjs( {
					namedExports: {
						// left-hand side can be an absolute path, a path
						// relative to the current directory, or the name
						// of a module in node_modules
						'object-path': [ 'get', 'set' ],
					},
				} ),
				replace( {
					'process.env.NODE_ENV': JSON.stringify( 'production' ),
				} ),
			]
		} );
		const outBundle = await confBundle.generate( { format: 'iife' } );
		const { output: [{ code }] } = outBundle;
		const outFileName = file.outputPath.replace( /\.ts(x?)$/, '-out-bundled.js$1' );
		const outDirName = dirname( outFileName );
		await mkdir( outDirName );
		await writeFile( outFileName, code );
		return outFileName;
	})
}
