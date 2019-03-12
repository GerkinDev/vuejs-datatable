/* eslint-disable no-undef */
// Import this named export into your test file:
export const getRepresentation = jest.fn( function getRepresentation( row ){
	return this.field ? row[this.field] : this.representedAs( row ); 
} );
const mock = jest.fn().mockImplementation( function mockColumn( config ){
	Object.assign( this, config );
	this.matches = ( row, filter ) => `${ this.getRepresentation( row ) }`.toLowerCase().indexOf( filter.toLowerCase() ) > -1;
	this.getRepresentation = getRepresentation.bind( this );
	return this;
} );

export default mock;
