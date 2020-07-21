module.exports = {
	...require('./jest.config'),
    collectCoverage: false,
	testMatch: [
		'**/__tests__/integration/**/*.spec.[jt]s',
		'!**/__tests__/helpers/**/*.[jt]s',
	],
};
