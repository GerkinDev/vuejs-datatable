/* eslint-disable no-undef */
export const filterHandler = jest.fn();
export const sortHandler = jest.fn();
export const paginateHandler = jest.fn();
export const displayHandler = jest.fn();
const mock = jest.fn().mockImplementation( function mockHandler(){
	this.filterHandler = filterHandler;
	this.sortHandler = sortHandler;
	this.paginateHandler = paginateHandler;
	this.displayHandler = displayHandler;
	return this;
} );

export default mock;
