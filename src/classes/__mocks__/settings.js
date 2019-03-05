/* eslint-disable no-undef */
export const get = jest.fn();
export const set = jest.fn();
export const merge = jest.fn();
const mock = jest.fn().mockImplementation( function mockSettings(){
	this.get = get;
	this.set = set;
	this.merge = merge;
	return this;
} );

export default mock;
