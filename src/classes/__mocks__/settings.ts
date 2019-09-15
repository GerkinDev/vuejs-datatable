/* eslint-disable no-undef */
export const get = jest.fn();
export const set = jest.fn();
export const merge = jest.fn();
export const Settings = jest.fn().mockImplementation( function mockSettings( this: any ) {
	this.get = get;
	this.set = set;
	this.merge = merge;
	return this;
} );
