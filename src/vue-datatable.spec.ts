// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, shallowMount } from '@vue/test-utils';
// tslint:disable-next-line: no-implicit-dependencies
import flushPromises = require( 'flush-promises' );

jest.mock( './vue-datatable-header.vue' );
jest.mock( './classes/column' );
jest.mock( './classes/settings' );
jest.mock( './classes/handler' );
import Column from './classes/column';
import Handler, { displayHandler, filterHandler, paginateHandler, sortHandler } from './classes/handler';
import Settings from './classes/settings';
import DatatableHeaderComponent from './vue-datatable-header.vue';
import DatatableComponent from './vue-datatable.vue';

const localVue = createLocalVue();
localVue.component( 'datatable-header', DatatableHeaderComponent );

beforeEach( () => {
	jest.clearAllMocks();
	localVue.prototype.$datatables = {};
} );
it( 'Should normalize columns by constructing Column class instances', () => {
	const columns = [
		{ field: 'id' },
		{ field: 'name' },
	];
	const wrapper = shallowMount<any>( DatatableComponent, { localVue, propsData: { columns, data: [] }, settings: new Settings(), handler: new Handler() } as any );
	const normalized = wrapper.vm.normalizedColumns;
	expect( Column ).toHaveBeenCalledTimes( 2 );
	expect( Column ).toHaveBeenNthCalledWith( 1, columns[0] );
	expect( Column ).toHaveNthReturnedWith( 1, normalized[0] );
	expect( Column ).toHaveBeenNthCalledWith( 2, columns[1] );
	expect( Column ).toHaveNthReturnedWith( 2, normalized[1] );
} );
describe( 'Row processing', () => {
	it( 'Should process provided data with handlers if it is not a function', async () => {
		const columns = [];
		const data = [];
		const filtered = [];
		filterHandler.mockReturnValue( filtered );
		const sorted = [];
		sortHandler.mockReturnValue( sorted );
		const paged = [];
		paginateHandler.mockReturnValue( paged );
		const displayed = { rows: [], totalRowCount: 42 };
		displayHandler.mockReturnValue( displayed );
		const setTableContent = jest.spyOn( ( DatatableComponent as any ).methods, 'setTableContent' );
		const wrapper = shallowMount<any>( DatatableComponent, Object.assign(
			{ localVue, propsData: { columns, data, filter: 'foo' } },
			{ settings: new Settings(), handler: new Handler() },
		) );
		const pseudoSortCol = new Column( { field: 'bar' } );
		wrapper.setData( { sortBy: pseudoSortCol, sortDir: 'desc', page: 20, perPage: 18 } );
		await flushPromises();
		jest.clearAllMocks();
		await wrapper.vm.processRows();
		expect( filterHandler ).toHaveBeenCalledTimes( 1 );
		expect( filterHandler ).toHaveBeenCalledWith( data, 'foo', wrapper.vm.normalizedColumns );
		expect( sortHandler ).toHaveBeenCalledTimes( 1 );
		expect( sortHandler ).toHaveBeenCalledWith( filtered, pseudoSortCol, 'desc' );
		expect( paginateHandler ).toHaveBeenCalledTimes( 1 );
		expect( paginateHandler ).toHaveBeenCalledWith( sorted, 18, 20 );
		expect( displayHandler ).toHaveBeenCalledTimes( 1 );
		expect( displayHandler.mock.calls[0] ).toHaveLength( 1 );
		expect( displayHandler.mock.calls[0][0] ).toHaveProperty( 'source', data );
		expect( displayHandler.mock.calls[0][0] ).toHaveProperty( 'filtered', filtered );
		expect( displayHandler.mock.calls[0][0] ).toHaveProperty( 'paged', paged );
		expect( displayHandler.mock.calls[0][0] ).toHaveProperty( 'sorted', sorted );
		expect( setTableContent ).toHaveBeenCalledTimes( 1 );
		expect( setTableContent ).toHaveBeenCalledWith( displayed );
	} );
	it( 'Should process rows using the data function', async () => {
		const columns = [];
		const displayed = { rows: [], totalRowCount: 42 };
		const data = jest.fn().mockReturnValue( displayed );
		const setTableContent = jest.spyOn( ( DatatableComponent as any ).methods, 'setTableContent' );
		const wrapper = shallowMount<any>( DatatableComponent, Object.assign(
			{ localVue, propsData: { columns, data, filter: 'foo' } },
			{ settings: new Settings(), handler: new Handler() },
		) );
		const pseudoSortCol = new Column( { field: 'bar' } );
		wrapper.setData( { sortBy: pseudoSortCol, sortDir: 'desc', page: 20, perPage: 18 } );
		await flushPromises();
		jest.clearAllMocks();
		await wrapper.vm.processRows();
		expect( data ).toHaveBeenCalledTimes( 1 );
		expect( data.mock.calls[0] ).toHaveLength( 1 );
		expect( data.mock.calls[0][0] ).toBeInstanceOf( Object );
		expect( data.mock.calls[0][0] ).toHaveProperty( 'filter', 'foo' );
		expect( data.mock.calls[0][0] ).toHaveProperty( 'sortBy', 'bar' );
		expect( data.mock.calls[0][0] ).toHaveProperty( 'sortDir', 'desc' );
		expect( data.mock.calls[0][0] ).toHaveProperty( 'page', 20 );
		expect( data.mock.calls[0][0] ).toHaveProperty( 'perPage', 18 );
		expect( setTableContent ).toHaveBeenCalledTimes( 1 );
		expect( setTableContent ).toHaveBeenCalledWith( displayed );
	} );
} );

export {};
