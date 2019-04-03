/* eslint-disable no-undef */
// Import this named export into your test file:
export const getRepresentation = jest.fn( function( this: any, row: any ) {
	return this.field ? row[this.field] : this.representedAs( row );
} );
export const Column = jest.fn().mockImplementation( function( this: any, config: any ) {
	Object.assign( this, config );
	this.matches = ( row: {}, filter: string ) => `${ this.getRepresentation( row ) }`.toLowerCase().indexOf( filter.toLowerCase() ) > -1;
	this.getRepresentation = getRepresentation.bind( this );
	return this;
} );
