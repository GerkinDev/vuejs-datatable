// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, ThisTypedMountOptions, Wrapper } from '@vue/test-utils';
// tslint:disable-next-line: no-implicit-dependencies
import flushPromises from 'flush-promises';
import Vue, { CreateElement } from 'vue';

import { mountVueDatatablePager as _mountVueDatatablePager } from '../../../__tests__/helpers/mount-mixin-components';
jest.mock( '../../classes/table-type' );
jest.mock( '../../classes/settings' );
// @ts-ignore
import { setting, TableType } from '../../classes/table-type';
import { EPagerType, namespaceEvent } from '../../utils';
import { ITableTypeConsumer } from '../mixins/table-type-consumer-factory';
import { VueDatatablePager } from './vue-datatable-pager';

const localVue = createLocalVue();
const DatatableButton = {
	render( createElement: CreateElement ) {
		return createElement( 'li', this.$slots.default || this.value );
	},
	props: { value: { type: Number }},
};
const makeDefaultTableMock = ( tableProps: Partial<{ totalPages: number; totalRows: number }> = {} ) =>
	Object.assign( { $emit: jest.fn(), pagers: [], $on: jest.fn(), totalPages: 0, totalRows: Infinity }, tableProps );
const mountVueDatatablePager = (
	mountOptions: ThisTypedMountOptions<VueDatatablePager<VueDatatablePager<any>> & ITableTypeConsumer & Vue>,
	tableProps: Partial<{ totalPages: number; totalRows: number }> = {},
) => {
	const defaultTable = makeDefaultTableMock( tableProps );
	localVue.prototype.$datatables = { default: defaultTable };
	mountOptions = Object.assign( mountOptions, { stubs: { PagerButton: DatatableButton }} );
	const wrapper = _mountVueDatatablePager( true, new TableType( 'foo' ), mountOptions );
	// Re-set data that were re-initialized in the ctor
	return { wrapper, defaultTable };
};
const getTextContent = ( wrapper: Wrapper<any> ) => wrapper.element.outerHTML
	.replace( /></g, '> <' )
	.replace( /<[^>]+?>/g, '' )
	.replace( /[\s\n]+/g, ' ' )
	.trim();

beforeEach( () => {
	jest.clearAllMocks();
	jest.restoreAllMocks();
	localVue.prototype.$datatables = {};
} );

describe( 'Pager types', () => {
	describe( 'Abbreviated', () => {
		it( 'With default number of sides items, on first page', async () => {
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Abbreviated }, data: () => ( { totalPages: 10, page: 1 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( '1 2 3 ... 10' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 5 );
		} );
		it( 'With default number of sides items, on central page', async () => {
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Abbreviated }, data: () => ( { totalPages: 10, page: 5 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( '1 ... 3 4 5 6 7 ... 10' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 9 );
		} );
		it( 'With default number of sides items, on last page', async () => {
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Abbreviated }, data: () => ( { totalPages: 10, page: 10 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( '1 ... 8 9 10' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 5 );
		} );
		it( 'With 1 side items, on central page', async () => {
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Abbreviated, sidesCount: 1 }, data: () => ( { totalPages: 10, page: 5 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( '1 ... 4 5 6 ... 10' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 7 );
		} );
	} );
	describe( 'Short', () => {
		it( 'Central page', async () => {
			setting.mockImplementation( p => ( { 'pager.icons.previous': 'PREV', 'pager.icons.next': 'NEXT' } )[p] );
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Short }, data: () => ( { totalPages: 5, page: 3 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( 'PREV 3 NEXT' );
			expect( setting ).toHaveBeenCalledWith( 'pager.icons.previous' );
			expect( setting ).toHaveBeenCalledWith( 'pager.icons.next' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 3 );
		} );
		it( 'First page', async () => {
			setting.mockImplementation( p => ( { 'pager.icons.previous': 'PREV', 'pager.icons.next': 'NEXT' } )[p] );
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Short }, data: () => ( { totalPages: 5, page: 1 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( '1 NEXT' );
			expect( setting ).not.toHaveBeenCalledWith( 'pager.icons.previous' );
			expect( setting ).toHaveBeenCalledWith( 'pager.icons.next' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 2 );
		} );
		it( 'Last page', async () => {
			setting.mockImplementation( p => ( { 'pager.icons.previous': 'PREV', 'pager.icons.next': 'NEXT' } )[p] );
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Short }, data: () => ( { totalPages: 5, page: 5 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( 'PREV 5' );
			expect( setting ).toHaveBeenCalledWith( 'pager.icons.previous' );
			expect( setting ).not.toHaveBeenCalledWith( 'pager.icons.next' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 2 );
		} );
	} );
	describe( 'Long', () => {
		it( 'Default', async () => {
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { type: EPagerType.Long }, data: () => ( { totalPages: 2 } ) } );
			await flushPromises();

			expect( wrapper.element.nodeName ).toBe( 'NAV' );
			expect( getTextContent( wrapper ) ).toBe( '1 2' );
			expect( wrapper.element.children.length ).toBe( 1 );
			expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
			expect( wrapper.element.children[0].children.length ).toBe( 2 );
		} );
	} );
} );
describe( 'Table-Pager linking', () => {
	describe( '`created`', () => {
		it( 'Pager should try to link the table on creation', () => {
			const mockLinkWithTable = jest.spyOn( ( VueDatatablePager as any ).extendOptions.methods, 'linkWithTable' );
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { table: 'foo' }} );
			expect( mockLinkWithTable ).toHaveBeenCalledTimes( 1 );
			expect( mockLinkWithTable ).toHaveBeenCalledWith( 'foo' );
		} );
		it( 'Pager should not bind event initialization on successfull immediate linking', () => {
			jest.spyOn( ( VueDatatablePager as any ).extendOptions.methods, 'linkWithTable' ).mockReturnValue( true );
			const $onMock = jest.spyOn( localVue.prototype, '$on' );
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { table: 'foo' }} );
			expect( $onMock ).not.toHaveBeenCalled();
		} );
		it( 'Pager should bind event initialization on failed immediate linking', () => {
			const $onMock = jest.spyOn( localVue.prototype, '$on' );
			const $offMock = jest.spyOn( localVue.prototype, '$off' );
			const mockLinkWithTable = jest.spyOn( ( VueDatatablePager as any ).extendOptions.methods, 'linkWithTable' ).mockReturnValue( false );
			const { wrapper } = mountVueDatatablePager( { localVue, propsData: { table: 'foo' }} );
			expect( $onMock ).toHaveBeenCalledTimes( 1 );
			expect( $onMock.mock.calls[0][0] ).toBe( namespaceEvent( 'ready' ) );
			const callback = $onMock.mock.calls[0][1] as ( tableName: string ) => void;
			expect( callback ).toBeInstanceOf( Function );
			// Deregister itself on resolution
			expect( $offMock ).not.toHaveBeenCalled();

			mockLinkWithTable.mockClear();
			callback( 'bar' );
			expect( $offMock ).not.toHaveBeenCalled();
			expect( mockLinkWithTable ).not.toHaveBeenCalled();

			mockLinkWithTable.mockReturnValue( true );
			callback( 'foo' );
			expect( $offMock ).toHaveBeenCalledTimes( 1 );
			expect( $offMock.mock.calls[0][0] ).toBe( namespaceEvent( 'ready' ) );
			expect( $offMock.mock.calls[0][1] ).toBe( callback );
			expect( mockLinkWithTable ).toHaveBeenCalledTimes( 1 );
			expect( mockLinkWithTable ).toHaveBeenCalledWith( 'foo' );
		} );
	} );

	describe( '`linkWithTable`', () => {
		it( 'Should fail if the table does not exists', () => {
			const that = { $datatables: {}};
			const linkWithTable = ( VueDatatablePager as any ).extendOptions.methods.linkWithTable as ( tableName: string ) => boolean;
			expect( linkWithTable.call( that, 'foo' ) ).toBe( false );
		} );
		it( 'Should succeed if the table exists', () => {
			const tableMock = makeDefaultTableMock();
			const that = { $datatables: { foo: tableMock }, onPageCountChanged: jest.fn(), onPageChanged: jest.fn(), $on: jest.fn(), onSetPage: jest.fn() };
			const linkWithTable = ( VueDatatablePager as any ).extendOptions.methods.linkWithTable as ( tableName: string ) => boolean;
			expect( linkWithTable.call( that, 'foo' ) ).toBe( true );

			// Assert that the table was correctly notified of changes
			expect( tableMock.$emit ).toHaveBeenCalledTimes( 1 );
			expect( tableMock.$emit ).toHaveBeenCalledWith( namespaceEvent( 'pager-bound' ), that );
			// Assert that table events were correctly bound
			expect( tableMock.$on ).toHaveBeenCalledTimes( 2 );
			expect( tableMock.$on ).toHaveBeenCalledWith( namespaceEvent( 'page-count-changed' ), that.onPageCountChanged );
			expect( tableMock.$on ).toHaveBeenCalledWith( namespaceEvent( 'page-changed' ), that.onPageChanged );

			expect( that.$on ).toHaveBeenCalledWith( namespaceEvent( 'set-page' ), that.onSetPage );
		} );
	} );
} );
it( 'returns the correct pagination class', () => {
	setting.mockReturnValue( 'PAGINATION' );
	const { wrapper } = mountVueDatatablePager( { localVue } );

	expect( wrapper.vm.paginationClass ).toBe( 'PAGINATION' );
	expect( setting ).toHaveBeenCalledTimes( 1 );
	expect( setting ).toHaveBeenCalledWith( 'pager.classes.pager' );
} );
