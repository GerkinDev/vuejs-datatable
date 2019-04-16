import { Settings } from './settings';

/* eslint-disable no-undef */
// Import this named export into your test file:
export const getTableDefinition = jest.fn( v => v );
export const getPagerDefinition = jest.fn( v => v );
export const setting = jest.fn( v => v );
export const TableType = jest.fn().mockImplementation( function mockTableType( this: any, id: string ) {
	Object.defineProperty( this, 'id', {
		get: () => id,
	} );
	this.getTableDefinition = () => getTableDefinition( { name: id } );
	this.getPagerDefinition = () => getPagerDefinition( { name: `${ id }-pager` } );
	this.handler = {};
	this.settings = new Settings();
	this.setting = setting;
	return this;
} );
