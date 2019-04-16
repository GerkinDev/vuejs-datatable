import Vue from 'vue';

jest.mock( '../components/vue-datatable/vue-datatable' );
jest.mock( '../components/vue-datatable-pager/vue-datatable-pager' );
jest.mock( './settings' );
jest.mock( './handlers/default-handler' );
import { VueDatatablePager } from '../components/vue-datatable-pager/vue-datatable-pager';
import { VueDatatable } from '../components/vue-datatable/vue-datatable';
import { DefaultHandler } from './handlers/default-handler';
// @ts-ignore
import { get, merge, set, Settings } from './settings';
import { TableType } from './table-type';

it( 'is initialized with name, a new settings settings, and a new handler', () => {
	const tabletype1 = new TableType<any>( 'name' );
	expect( tabletype1.id ).toBe( 'name' );
	expect( typeof tabletype1.settings ).toBe( 'object' );
	expect( typeof tabletype1.handler ).toBe( 'object' );

	const tabletype2 = new TableType<any>( 'name2' );
	expect( tabletype2.id ).toBe( 'name2' );
	expect( typeof tabletype1.settings ).toBe( 'object' );
	expect( typeof tabletype1.handler ).toBe( 'object' );

	expect( Settings ).toHaveBeenCalledTimes( 2 );
	expect( tabletype1.settings ).toEqual( tabletype2.settings );
	expect( tabletype1.settings ).not.toBe( tabletype2.settings );
	expect( DefaultHandler ).toHaveBeenCalledTimes( 2 );
	expect( tabletype1.handler ).toEqual( tabletype2.handler );
	expect( tabletype1.handler ).not.toBe( tabletype2.handler );
} );
it( 'can customize handlers', () => {
	const tabletype = new TableType<any>( 'name' );

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
		const tabletype = new TableType<any>( 'name' );
		tabletype.setting( 'foo.bar' );
		expect( get ).toHaveBeenCalledTimes( 1 );
		expect( get ).toHaveBeenCalledWith( 'foo.bar' );
	} );
	it( 'Set', () => {
		const tabletype = new TableType<any>( 'name' );
		const obj = {};
		tabletype.setting( 'foo.bar', obj );
		expect( set ).toHaveBeenCalledTimes( 1 );
		expect( set ).toHaveBeenCalledWith( 'foo.bar', obj );
	} );
	it( 'Merge', () => {
		const tabletype = new TableType<any>( 'name' );
		const obj = {};
		tabletype.mergeSettings( obj );
		expect( merge ).toHaveBeenCalledTimes( 1 );
		expect( merge ).toHaveBeenCalledWith( obj );
	} );
} );
describe( 'Can generate table/pager definitions', () => {
	it( 'Generate table', () => {
		const tabletype = new TableType<any>( 'name' );

		const tableDefinition = tabletype.getTableDefinition();
		const componentProtoIndex = ( ( tableDefinition as any ).extendOptions.mixins as Array<typeof Vue> ).indexOf( VueDatatable );
		expect( componentProtoIndex ).not.toBe( -1 );
		const otherMixins = ( ( tableDefinition as any ).extendOptions.mixins as Array<typeof Vue> )
			.filter( ( v, i ) => i !== componentProtoIndex );
		expect( otherMixins ).toHaveLength( 1 );
		expect( ( otherMixins[0] as any ).extendOptions.computed.tableType.get() ).toBe( tabletype );
	} );
	it( 'Generate pager', () => {
		const tabletype = new TableType<any>( 'name' );

		const pagerDefinition = tabletype.getPagerDefinition();
		const componentProtoIndex = ( ( pagerDefinition as any ).extendOptions.mixins as Array<typeof Vue> ).indexOf( VueDatatablePager );
		expect( componentProtoIndex ).not.toBe( -1 );
		const otherMixins = ( ( pagerDefinition as any ).extendOptions.mixins as Array<typeof Vue> )
			.filter( ( v, i ) => i !== componentProtoIndex );
		expect( otherMixins ).toHaveLength( 1 );
		expect( ( otherMixins[0] as any ).extendOptions.computed.tableType.get() ).toBe( tabletype );
	} );
} );
