module.exports = {
	...require('./package').jest,
	testMatch: [
		'**/__tests__/integration/**/*.[jt]s',
		'!**/__tests__/helpers/**/*.[jt]s',
	],
};
