/* eslint-disable no-undef */
export const filterHandler = jest.fn();
export const sortHandler = jest.fn();
export const paginateHandler = jest.fn();
export const displayHandler = jest.fn();
export const DefaultHandler = jest.fn().mockImplementation( function( this: any ) {
	this.filterHandler = filterHandler;
	this.sortHandler = sortHandler;
	this.paginateHandler = paginateHandler;
	this.displayHandler = displayHandler;
	return this;
} );
