module.exports = {
	...require('./jest.config'),
    collectCoverage: true,
	testMatch: [
		'<rootDir>/src/**/*.{spec,test}.[jt]s',
		'!**/__tests__/helpers/**/*.[jt]s',
	],
};
