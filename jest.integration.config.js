module.exports = {
	...require('./package').jest,
	testMatch: [
		'**/__tests__/**/*.[jt]s',
		'!**/__tests__/helpers/**/*.[jt]s',
	],
};
