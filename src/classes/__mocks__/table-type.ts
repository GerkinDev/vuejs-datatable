/* eslint-disable no-undef */
// Import this named export into your test file:
export const getTableDefinition = jest.fn( v => v );
export const getPagerDefinition = jest.fn( v => v );
export const TableType = jest.fn().mockImplementation( function mockTableType( this: any, id: string ) {
	Object.defineProperty( this, 'id', {
		get: () => id,
	} );
	this.getTableDefinition = () => getTableDefinition( { name: id } );
	this.getPagerDefinition = () => getPagerDefinition( { name: `${ id }-pager` } );
	return this;
} );
