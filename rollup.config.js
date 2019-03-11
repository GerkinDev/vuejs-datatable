import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import { string } from 'rollup-plugin-string';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import license from 'rollup-plugin-license';
import visualizer from 'rollup-plugin-visualizer';

import { env } from 'process';
import { isString } from 'util';
import moment from 'moment';

const pkg = require( './package.json' );

// The module name
const name = pkg.name;
const allContributors = [ pkg.author ].concat( pkg.contributors );
const userToString = p => {
	if ( isString( p ) ){
		return p;
	}
	return p.name + ( p.email ? `<${  p.email  }>` : '' ) + ( p.url ? ` (${  p.url  })` : '' );
};
const allContributorsString = allContributors.map( userToString ).join( ', ' );
// Plugins used for build
const getPlugins = iife => {
	const babelPlugin = iife ? babel( { exclude: 'node_modules/**' } ) : undefined;

	const licensePlugin = env.BUILD === 'production' ? 
		license( {
			banner: `${ pkg.name } v${ pkg.version }
License: ${ pkg.license }
Repository: ${ pkg.repository.url }
Generated on ${ moment().format( 'YYYY-MM-DD [at] HH:mm:ss' ) }.
By ${ allContributorsString }`,
		} ) :
		undefined;
		
	const terserPlugin = [ 'production', 'demo' ].includes( env.BUILD ) ? terser() : undefined;

	const visualizerPlugin = env.BUILD === 'production' ? visualizer( { filename: `./stats/${ iife ? 'iife' : 'esm' }.html` } ) : undefined;

	return [
		vue( {
			compileTemplate: true,
			template:        { compilerOptions: { preserveWhitespace: false }},
		} ),
		babelPlugin,
		string( {include: [ '**/*.svg', '**/*.html' ]} ),
		commonjs( {
			namedExports: {
				// left-hand side can be an absolute path, a path
				// relative to the current directory, or the name
				// of a module in node_modules
				'object-path': [ 'get', 'set' ],
			},
		} ),
		resolve(),
		terserPlugin,
		licensePlugin,
		visualizerPlugin,
		// Filter out `undefined` plugins
	].filter( v => !!v );
};

// Destination dir
const outDir = 'dist';

// Should we generate source maps?
const sourcemap = true;

export default [
	{
		input:  './src/iife-init.js',
		output: {
			file:    `${ outDir }/${ name }.js`,
			format:  'iife',
			// Use `name` as window to hack a bit & avoid exports. The name of the exports is exposed globally. See https://github.com/rollup/rollup/issues/494
			name:    'window',
			extend:  true,
			sourcemap,
			globals: { vue: 'Vue' },
		},
		plugins:  getPlugins( true ),
		external: [ 'vue' ],
	},
	{
		input:  './src/index.js',
		output: {
			file:   `${ outDir }/${ name }.esm.js`,
			format: 'esm',
			name,
			sourcemap,
		},
		plugins:  getPlugins( false ),
		external: ( Object.keys( pkg.peerDependencies ) || [] )
			.concat( Object.keys( pkg.dependencies ) || [] ),
	},
];
