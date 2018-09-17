import vue from 'rollup-plugin-vue';
// TODO: Update `rollup-plugin-terser`
// See issue https://github.com/TrySound/rollup-plugin-terser/issues/5 that breaks mutli-output
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import string from 'rollup-plugin-string';
import babel from 'rollup-plugin-babel';

// The module name
const name = 'vuejs-datatable';

// Plugins used for build
const plugins = [
    vue({compileTemplate: true}),
    babel({exclude: 'node_modules/**'}),
    string({include: ['**/*.svg', '**/*.html']}),
    resolve(),
    process.env.BUILD === 'production' ? terser() : undefined,
    // Filter out `undefined` plugins
].filter(v => !!v);

// Destination dir
const outDir = 'dist';

// Should we generate source maps?
const sourcemap = true;

export default {
    input: 'index.js',
    experimentalCodeSplitting: true,
    external: ['object-path', 'vue'],
    sourcemap: true,
    output: [
        { name, file: `${outDir}/${name}.umd.js`, format: 'umd', sourcemap},
        { name, file: `${outDir}/${name}.es.js`, format: 'es', sourcemap},
    ],
    plugins
}