import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import license from 'rollup-plugin-license';
import visualizer from 'rollup-plugin-visualizer';
import typescript from 'rollup-plugin-typescript2';
import vueTemplateCompiler from 'rollup-plugin-vue-template-compiler';
import replace from 'rollup-plugin-replace';
import json from 'rollup-plugin-json';

import { isString } from 'util';
import moment from 'moment';
import _ from 'lodash';
import { readFileSync } from 'tsconfig';

// eslint-disable-next-line no-undef
const pkg = require( './package.json' );
const tsconfig = readFileSync( './tsconfig.json' );

const env = process.env.BUILD || 'development';
// The module name
const pkgName = pkg.name;
const globalName = 'VuejsDatatable';
const allContributors = [ pkg.author ].concat( pkg.contributors );
const userToString = p => {
	if ( isString( p ) ){
		return p;
	}
	return p.name + ( p.email ? `<${  p.email  }>` : '' ) + ( p.url ? ` (${  p.url  })` : '' );
};
const allContributorsString = allContributors.map( userToString ).join( ', ' );
// Plugins used for build
export const getPlugins = (iife, environment) => {
	const tsconfigOverride = {
		compilerOptions: {
			declaration: environment === 'production' && iife,
			sourceMap: environment === 'production' && iife,
		},
		exclude: environment !== 'demo' ? ['tutorials/**'] : undefined,
	};

	return _.compact( [
		environment !== 'demo' ? vueTemplateCompiler({
			include: '**/*.html',
			compilerOpts: {
				whitespace: 'condense'
			}
		}) : undefined,

		resolve({
			extensions: [ '.ts', '.js', '.json' ],
			browser: true,
		}),
		json(),
		commonjs( {
			namedExports: {
				// left-hand side can be an absolute path, a path
				// relative to the current directory, or the name
				// of a module in node_modules
				'object-path': [ 'get', 'set' ],
				'lodash': Object.keys(_)
			},
		} ),
		typescript({
			objectHashIgnoreUnknownHack: true,
			clean: true,//environment === 'production',
			include: _.compact( [
				"src/*.ts",
				"src/**/*.ts",
				environment === 'demo' ? "tutorials/.tmp/**/*.ts" : undefined,
				environment === 'demo' ? "tutorials/**/*.ts" : undefined,
			] ),
			tsconfigOverride,
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify( environment ),
		}),

		environment === 'production' ?  license( {
			banner: `${ pkg.name } v${ pkg.version }
License: ${ pkg.license }
Repository: ${ pkg.repository.url }
Generated on ${ moment().format( 'YYYY-MM-DD [at] HH:mm:ss' ) }.
By ${ allContributorsString }`,
		} ) : undefined,

		environment === 'production' ? terser({
			compress: {
				passes: 2,
				unsafe: true,
                keep_classnames: true
			},
		}) : undefined,

		environment === 'production' ? visualizer( { filename: `./stats/${ iife ? 'iife' : 'esm' }.html` } ) : undefined,

		iife ? babel( {
			exclude: 'node_modules/**',
			extensions: ['.js', '.ts', '.html'],
		} ) : undefined,
	] );
}

// Destination dir
const outDir = 'dist';

// Should we generate source maps?
const sourcemap = true;


const externalDeps = ( Object.keys( pkg.peerDependencies ) || [] )
	.concat( Object.keys( pkg.dependencies ) || [] );


const makeThemeConfig = themeName => {
	const baseConfig = {
		input:  `./src/themes/${themeName}.ts`,
		output: {
			sourcemap,
			globals: { [pkgName]: globalName },
		},
		plugins:  getPlugins( false, env ),
		external: externalDeps.concat( [ pkgName ] ),
	};
	return [
		{
			...baseConfig,
			output: {
				...baseConfig.output,
				file:   `${ outDir }/themes/${themeName}.js`,
				format: 'iife',
			},
		},
		{
			...baseConfig,
			output: {
				...baseConfig.output,
				file:   `${ outDir }/themes/${themeName}.esm.js`,
				format: 'esm',
			},
		},
	]
}


export default () => [
	{
		input:  './src/vuejs-datatable.ts',
		output: {
			file:    `${ outDir }/${ pkgName }.js`,
			format:  'iife',
			// Use `name` as window to hack a bit & avoid exports. The name of the exports is exposed globally. See https://github.com/rollup/rollup/issues/494
			name:    globalName,
			extend:  true,
			sourcemap,
			globals: { vue: 'Vue' },
		},
		plugins:  getPlugins( true, env ),
		external: [ 'vue' ],
	},
	{
		input:  './src/vuejs-datatable.esm.ts',
		output: {
			file:   `${ outDir }/${ pkgName }.esm.js`,
			format: 'esm',
			name: pkgName,
			sourcemap,
		},
		plugins:  getPlugins( false, env ),
		external: externalDeps,
	},
	
	// Themes
	...makeThemeConfig( 'bootstrap-3' ),
	...makeThemeConfig( 'bootstrap-4' ),
];
