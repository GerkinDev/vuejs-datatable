// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, shallowMount, ThisTypedMountOptions } from '@vue/test-utils';
// tslint:disable-next-line: no-implicit-dependencies
import flushPromises from 'flush-promises';
import Vue from 'vue';

import { mountVueDatatable as _mountVueDatatable } from '../../../__tests__/helpers/mount-mixin-components';

jest.mock( '../vue-datatable-header/vue-datatable-header' );
jest.mock( '../../classes/column' );
jest.mock( '../../classes/handlers/default-handler' );
import { TableType } from '../../classes';
import { Column } from '../../classes/column';
// @ts-ignore
import { displayHandler, filterHandler, paginateHandler, sortHandler } from '../../classes/handlers/default-handler';
import { ITableTypeConsumer } from '../mixins/table-type-consumer-factory';
import { VueDatatableHeader } from '../vue-datatable-header/vue-datatable-header';
import { VueDatatable } from './vue-datatable';

const localVue = createLocalVue();
localVue.component( 'datatable-header', VueDatatableHeader );

const mountVueDatatable = ( mountOptions: ThisTypedMountOptions<VueDatatable<any, VueDatatable<any, any>> & ITableTypeConsumer & Vue> ) =>
	_mountVueDatatable( true, new TableType( 'foo' ), mountOptions );

beforeEach( () => {
	jest.clearAllMocks();
	localVue.prototype.$datatables = {};
} );
it( 'Should normalize columns by constructing Column class instances', () => {
	const columns = [
		{ field: 'id' },
		{ field: 'name' },
	];
	const wrapper = mountVueDatatable( { localVue, propsData: { columns, data: [] }} );
	const normalized = wrapper.vm['normalizedColumns' as any];
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
		const setTableContent = jest.spyOn( ( VueDatatable as any ).extendOptions.methods, 'setTableContent' as any );
		const wrapper = mountVueDatatable( { localVue, propsData: { columns, data, filter: 'foo' }} );
		const pseudoSortCol = new Column<any>( { label: '', field: 'bar' } );
		wrapper.setData( { sortBy: pseudoSortCol, sortDir: 'desc', page: 20 } );
		wrapper.setProps( { perPage: 18 } );
		await flushPromises();
		jest.clearAllMocks();
		await wrapper.vm.processRows();
		expect( filterHandler ).toHaveBeenCalledTimes( 1 );
		expect( filterHandler ).toHaveBeenCalledWith( data, 'foo', wrapper.vm['normalizedColumns' as any] );
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
		const setTableContent = jest.spyOn( ( VueDatatable as any ).extendOptions.methods, 'setTableContent' as any );
		const wrapper = mountVueDatatable( { localVue, propsData: { columns, data, filter: 'foo' }} );
		const pseudoSortCol = new Column<any>( { label: '', field: 'bar' } );
		wrapper.setData( { sortBy: pseudoSortCol, sortDir: 'desc', page: 20 } );
		wrapper.setProps( { perPage: 18 } );
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

describe( 'Pages count calculation', () => {
	it.each( [
		[15, 5, 3],
		[20, 2, 10],
		[16, 5, 4],
		[0, 15, 0],
		[15, 0, 0],
	] )( 'returns the correct total number of pages (%d items, %d items per page, %p expected pages)', ( items: number, perPage: number, pages: number ) => {
		const wrapper = mountVueDatatable( { localVue, propsData: { perPage, columns: [], data: [] }, data: () => ( { totalRows: items } ) } );
		expect( wrapper.vm['totalPages' as any] ).toBe( pages );
	} );
} );
