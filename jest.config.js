module.exports = {
	...require('./package').jest,
	
	testMatch: [...new Set([]
		.concat(require('./jest.unit.config').testMatch)
		.concat(require('./jest.integration.config').testMatch)
	)]
}
