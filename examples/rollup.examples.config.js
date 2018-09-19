import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

// The module name
const name = 'vuejs-datatable';

// Plugins used for build
const plugins = [
	commonjs({
		namedExports: {
			// left-hand side can be an absolute path, a path
			// relative to the current directory, or the name
			// of a module in node_modules
			'object-path': [ 'get', 'set' ],
			'axios': [ 'get' ],
		}
	}),
	json(),
	resolve(),
	terser(),
];

// Destination dir
const outDir = 'build';

// Should we generate source maps?
const sourcemap = true;

const generateDemoConfig = dir => ({
	input: `${__dirname}/${dir}/app.js`,
	output: {
		file: `${__dirname}/${dir}/${outDir}/app.js`,
		format: 'iife',
		// Use `name` as window to hack a bit & avoid exports.
		name: 'window',
		sourcemap,
		globals: { vue: 'Vue' },
	},
	plugins,
	external: ['vue'],
})

export default [
	generateDemoConfig('ajax'),
	generateDemoConfig('custom-theme'),
]