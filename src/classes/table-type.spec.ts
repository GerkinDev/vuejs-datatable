jest.mock( './settings' );
jest.mock( './handler' );
import Handler from './handler';
import Settings, { get, merge, set } from './settings';
import TableType from './table-type';

it( 'is initialized with name, a new settings settings, and a new handler', () => {
	const tabletype1 = new TableType( 'name' );
	expect( tabletype1.id ).toBe( 'name' );
	expect( typeof tabletype1.settings ).toBe( 'object' );
	expect( typeof tabletype1.handler ).toBe( 'object' );

	const tabletype2 = new TableType( 'name2' );
	expect( tabletype2.id ).toBe( 'name2' );
	expect( typeof tabletype1.settings ).toBe( 'object' );
	expect( typeof tabletype1.handler ).toBe( 'object' );

	expect( Settings ).toHaveBeenCalledTimes( 2 );
	expect( tabletype1.settings ).toEqual( tabletype2.settings );
	expect( tabletype1.settings ).not.toBe( tabletype2.settings );
	expect( Handler ).toHaveBeenCalledTimes( 2 );
	expect( tabletype1.handler ).toEqual( tabletype2.handler );
	expect( tabletype1.handler ).not.toBe( tabletype2.handler );
} );
it( 'can customize handlers', () => {
	const tabletype = new TableType( 'name' );

	expect( typeof tabletype.setFilterHandler ).toBe( 'function' );
	const filterHandlerMock = jest.fn();
	expect( tabletype.setFilterHandler( filterHandlerMock ) ).toBe( tabletype );
	expect( tabletype.handler.filterHandler ).toBe( filterHandlerMock );

	expect( typeof tabletype.setSortHandler ).toBe( 'function' );
	const sortHandlerMock = jest.fn();
	expect( tabletype.setSortHandler( sortHandlerMock ) ).toBe( tabletype );
	expect( tabletype.handler.sortHandler ).toBe( sortHandlerMock );

	expect( typeof tabletype.setPaginateHandler ).toBe( 'function' );
	const paginateHandlerMock = jest.fn();
	expect( tabletype.setPaginateHandler( paginateHandlerMock ) ).toBe( tabletype );
	expect( tabletype.handler.paginateHandler ).toBe( paginateHandlerMock );
} );

describe( 'Settings getter/setter/merge', () => {
	it( 'Get', () => {
		const tabletype = new TableType( 'name' );
		tabletype.setting( 'foo.bar' );
		expect( get ).toHaveBeenCalledTimes( 1 );
		expect( get ).toHaveBeenCalledWith( 'foo.bar' );
	} );
	it( 'Set', () => {
		const tabletype = new TableType( 'name' );
		const obj = {};
		tabletype.setting( 'foo.bar', obj );
		expect( set ).toHaveBeenCalledTimes( 1 );
		expect( set ).toHaveBeenCalledWith( 'foo.bar', obj );
	} );
	it( 'Merge', () => {
		const tabletype = new TableType( 'name' );
		const obj = {};
		tabletype.mergeSettings( obj );
		expect( merge ).toHaveBeenCalledTimes( 1 );
		expect( merge ).toHaveBeenCalledWith( obj );
	} );
} );
describe( 'Can generate table/pager definitions', () => {
	it( 'Generate table', () => {
		const tabletype = new TableType( 'name' );
		const protoClone = {};
		const mockClone = jest.spyOn( tabletype, 'clone' ).mockReturnValue( protoClone );

		const tableDefinition = tabletype.getTableDefinition();
		expect( tableDefinition ).toBe( protoClone );
		expect( tableDefinition ).toHaveProperty( 'settings', tabletype.settings );
		expect( tableDefinition ).toHaveProperty( 'handler', tabletype.handler );
		expect( tableDefinition ).toHaveProperty( 'name', 'name' );
	} );
	it( 'Generate pager', () => {
		const tabletype = new TableType( 'name' );
		const protoClone = {};
		const mockClone = jest.spyOn( tabletype, 'clone' ).mockReturnValue( protoClone );

		const tableDefinition = tabletype.getPagerDefinition();
		expect( tableDefinition ).toBe( protoClone );
		expect( tableDefinition ).toHaveProperty( 'settings', tabletype.settings );
		expect( tableDefinition ).toHaveProperty( 'name', 'name-pager' );
	} );
} );

describe( 'can clone objects/arrays', () => {
	it.each( [{ id: 1 }, [1, 2], [1, { id: 2 }]] )( 'Should clone object %p', orgObj => {
		const tabletype = new TableType( 'name' );
		const newObj = tabletype.clone( orgObj );

		expect( newObj ).not.toBe( orgObj );
		expect( newObj ).toEqual( orgObj );
	} );
	it.each( [1, true, 'foo', () => ( {} )] )( 'Should return the value %p as is', val => {
		const tabletype = new TableType( 'name' );
		expect( tabletype.clone( val ) ).toBe( val );
	} );
	it( 'Should not copy inherited value', () => {
		const tabletype = new TableType( 'name' );
		const proto = { bar: 2 };
		const orgObj = { foo: 1, __proto__: proto };
		const newObj = tabletype.clone( orgObj );

		expect( newObj ).not.toBe( orgObj );
		expect( newObj ).toEqual( orgObj );
		expect( newObj.__proto__ ).not.toBe( proto );
		expect( newObj.__proto__ ).toBe( Object.prototype );
	} );
} );
