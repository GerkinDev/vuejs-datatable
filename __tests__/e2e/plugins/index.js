const { writeFile: _writeFile } = require( 'fs' );
const { dirname } = require( 'path' );

const mkdirp = require( 'mkdirp' );

const { rollup } = require( 'rollup' );
const typescript = require( 'rollup-plugin-typescript2' );
const resolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );
const replace = require( 'rollup-plugin-replace' );

const writeFile = ( path, data, opts ) => new Promise( ( res, rej ) => _writeFile( path, data, opts, err => err ? rej( err ) : res() ) );
const mkdir = ( path, opts ) => new Promise( ( res, rej ) => mkdirp( path, opts, err => err ? rej( err ) : res() ) );

module.exports = on => {
	on('file:preprocessor', async (file) => {
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
