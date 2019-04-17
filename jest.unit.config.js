module.exports = {
	...require('./package').jest,
	testMatch: [
		'<rootDir>/src/**/*.{spec,test}.[jt]s',
		'!**/__tests__/helpers/**/*.[jt]s',
	],
};
