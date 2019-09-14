module.exports = {
	...require('./jest.config'),
    collectCoverage: false,
	testMatch: [
		'**/__tests__/integration/**/*.[jt]s',
		'!**/__tests__/helpers/**/*.[jt]s',
	],
};
