/* eslint-disable no-undef */
const mock = jest.fn().mockImplementation(function mockHandler(){
	return this;
});

export default mock;
