module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	moduleFileExtensions: [
		'js',
		'ts',
		'vue'
	],
	transform: {
		'.*\\.ts$': 'ts-jest',
		'.*\\.html$': '<rootDir>/__tests__/helpers/transform-vue-template.js'
	},
	collectCoverageFrom: [
		'src/**/*.{[jt]s,vue}',
		'!src/vuejs-datatable-{esm,}.ts',
		'!src/themes/**',
		'!**/node_modules/**'
	],
	globals: {
		'ts-jest': {
			'diagnostics': false
		}
	},
}
