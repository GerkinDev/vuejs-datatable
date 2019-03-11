// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';
// tslint:disable-next-line: no-implicit-dependencies
import flushPromises from 'flush-promises';

jest.mock( './classes/settings' );
import Settings, { get } from './classes/settings';
import DatatablePagerComponent from './vue-datatable-pager.vue';

const localVue = createLocalVue();
localVue.component( 'datatable-button', {
	render( createElement ) {
		return createElement( 'li', this.$slots.default || this.value );
	},
	props: { value: { type: Number } },
} );

beforeEach( () => {
	jest.clearAllMocks();
	jest.restoreAllMocks();
	localVue.prototype.$datatables = {};
} );

describe( 'HTML content', () => {
	it( 'builds base HTML for long type', async () => {
		get.mockImplementation( p => ( { 'pager.icons.previous': 'PREV', 'pager.icons.next': 'NEXT' } )[p] );
		localVue.prototype.$datatables = { default: { totalRows: 15, $emit: jest.fn(), pagers: [] } };
		const wrapper = mount( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: { type: 'long' } } as any );
		await flushPromises();

		expect( wrapper.element.nodeName ).toBe( 'NAV' );
		expect( wrapper.element.textContent.trim().replace( /[\s\n]+/g, ' ' ) ).toBe( '12' );
		expect( wrapper.element.children.length ).toBe( 1 );
		expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
		expect( wrapper.element.children[0].children.length ).toBe( 2 );
	} );
	it( 'builds base HTML for short type', async () => {
		get.mockImplementation( p => ( { 'pager.icons.previous': 'PREV', 'pager.icons.next': 'NEXT' } )[p] );
		localVue.prototype.$datatables = { default: { totalRows: 15, $emit: jest.fn(), pagers: [] } };
		const wrapper = mount( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: { type: 'short', perPage: 5, page: 2 } } as any );
		await flushPromises();

		expect( wrapper.element.nodeName ).toBe( 'NAV' );
		expect( wrapper.element.textContent.trim().replace( /[\s\n]+/g, ' ' ) ).toBe( 'PREV 2 NEXT' );
		expect( get ).toHaveBeenCalledWith( 'pager.icons.previous' );
		expect( get ).toHaveBeenCalledWith( 'pager.icons.next' );
		expect( wrapper.element.children.length ).toBe( 1 );
		expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
		expect( wrapper.element.children[0].children.length ).toBe( 3 );
	} );
	it( 'builds base HTML for abbreviated type', async () => {
		get.mockImplementation( p => ( { 'pager.icons.previous': 'PREV', 'pager.icons.next': 'NEXT' } )[p] );
		localVue.prototype.$datatables = { default: { totalRows: 100, $emit: jest.fn(), pagers: [] } };
		const wrapper = mount( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: { type: 'abbreviated' } } as any );
		await flushPromises();

		expect( wrapper.element.nodeName ).toBe( 'NAV' );
		expect( wrapper.element.textContent.trim().replace( /[\s\n]+/g, ' ' ) ).toBe( '1 2 3 ... 10' );
		expect( wrapper.element.children.length ).toBe( 1 );
		expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
		expect( wrapper.element.children[0].children.length ).toBe( 5 );
	} );
	it( 'builds base HTML for abbreviated type on center page', async () => {
		get.mockImplementation( p => ( { 'pager.icons.previous': 'PREV', 'pager.icons.next': 'NEXT' } )[p] );
		localVue.prototype.$datatables = { default: { totalRows: 100, $emit: jest.fn(), pagers: [] } };
		const wrapper = mount( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: { type: 'abbreviated', page: 5 } } as any );
		await flushPromises();

		expect( wrapper.element.nodeName ).toBe( 'NAV' );
		expect( wrapper.element.textContent.trim().replace( /[\s\n]+/g, ' ' ) ).toBe( '1 ... 3 4 5 6 7 ... 10' );
		expect( wrapper.element.children.length ).toBe( 1 );
		expect( wrapper.element.children[0].nodeName ).toBe( 'UL' );
		expect( wrapper.element.children[0].children.length ).toBe( 9 );
	} );
} );

describe( 'Table-Pager linking', () => {
	describe( '`created`', () => {
		it( 'Pager should try to link the table on creation', () => {
			const mockLinkWithTable = jest.spyOn( DatatablePagerComponent.methods, 'linkWithTable' );
			mount<any>( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: {table: 'foo'} } as any );
			expect( mockLinkWithTable ).toHaveBeenCalledTimes( 1 );
			expect( mockLinkWithTable ).toHaveBeenCalledWith( 'foo' );
		} );
		it( 'Pager should not bind event initialization on successfull immediate linking', () => {
			jest.spyOn( DatatablePagerComponent.methods, 'linkWithTable' ).mockReturnValue( true );
			const $onMock = jest.spyOn( localVue.prototype, '$on' );
			mount<any>( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: {table: 'foo'} } as any );
			expect( $onMock ).not.toHaveBeenCalled();
		} );
		it( 'Pager should bind event initialization on failed immediate linking', () => {
			const $onMock = jest.spyOn( localVue.prototype, '$on' );
			const $offMock = jest.spyOn( localVue.prototype, '$off' );
			const mockLinkWithTable = jest.spyOn( DatatablePagerComponent.methods, 'linkWithTable' ).mockReturnValue( false );
			const wrapper = mount<any>( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: {table: 'foo'} } as any );
			expect( $onMock ).toHaveBeenCalledTimes( 1 );
			expect( $onMock.mock.calls[0][0] ).toBe( 'table.ready' );
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
			expect( $offMock.mock.calls[0][0] ).toBe( 'table.ready' );
			expect( $offMock.mock.calls[0][1] ).toBe( callback );
			expect( mockLinkWithTable ).toHaveBeenCalledTimes( 1 );
			expect( mockLinkWithTable ).toHaveBeenCalledWith( 'foo' );
		} );
	} );

	describe( '`linkWithTable`', () => {
		it( 'Should fail if the table does not exists', () => {
			const that = {$datatables: {}};
			const linkWithTable = ( ( DatatablePagerComponent as any ).methods.linkWithTable as ( tableName: string ) => boolean );
			expect( linkWithTable.call( that, 'foo' ) ).toBe( false );
		} );
		it( 'Should succeed if the table exists', () => {
			const that = {$datatables: {foo: {$emit: jest.fn(), pagers: []}}, perPage: 42};
			const linkWithTable = ( ( DatatablePagerComponent as any ).methods.linkWithTable as ( tableName: string ) => boolean );
			expect( linkWithTable.call( that, 'foo' ) ).toBe( true );
			expect( that.$datatables.foo.$emit ).toHaveBeenCalledTimes( 1 );
			expect( that.$datatables.foo.$emit ).toHaveBeenCalledWith( 'table.pager-bound', that );
			expect( that ).toHaveProperty( 'tableInstance', that.$datatables.foo );
			expect<any>( that.$datatables.foo ).toHaveProperty( 'perPage', that.perPage );
		} );
	} );
} );
it( 'returns the correct pagination class', () => {
	get.mockReturnValue( 'PAGINATION' );
	const wrapper = mount<any>( DatatablePagerComponent, { localVue, settings: new Settings() } as any );

	expect( wrapper.vm.paginationClass ).toBe( 'PAGINATION' );
	expect( get ).toHaveBeenCalledTimes( 1 );
	expect( get ).toHaveBeenCalledWith( 'pager.classes.pager' );
} );

describe( 'Pages count calculation', () => {
	it.each( [
		[15, 5, 3],
		[20, 2, 10],
		[16, 5, 4],
		[0, 15, null],
		[15, 0, null],
	] )( 'returns the correct total number of pages (%d items, %d items per page, %p expected pages)', ( items: number, perPage: number, pages: number ) => {
		localVue.prototype.$datatables = { default: { totalRows: items, $emit: jest.fn(), pagers: [] } };
		const wrapper = mount<any>( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: { perPage } } as any );
		expect( wrapper.vm.totalPages ).toBe( pages );
	} );
} );

describe( 'properly adjusts the selected page', () => {
	it( 'properly adjusts the selected page when total pages changes', async () => {
		localVue.prototype.$datatables = { default: { totalRows: 15, $emit: jest.fn(), pagers: [] } };
		const wrapper = mount<any>( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: { perPage: 2, page: 5 } } as any );

		expect( wrapper.vm.page ).toBe( 5 );

		localVue.prototype.$datatables.default.totalRows = 50;
		await flushPromises();

		expect( wrapper.emitted().change ).toBeFalsy();

		localVue.prototype.$datatables.default.totalRows = 8;
		await flushPromises();

		expect( wrapper.emitted().change ).toHaveLength( 1 );
		expect( wrapper.emitted().change[0] ).toHaveLength( 1 );
		expect( wrapper.emitted().change[0][0] ).toBe( 4 );

		localVue.prototype.$datatables.default.totalRows = 20;
		await flushPromises();

		expect( wrapper.emitted().change ).toHaveLength( 1 );
	} );
	it( 'properly adjusts the selected page when items per page changes', async () => {
		localVue.prototype.$datatables = { default: { totalRows: 15, $emit: jest.fn(), pagers: [] } };
		const wrapper = mount<any>( DatatablePagerComponent, { localVue, settings: new Settings(), propsData: { perPage: 2, page: 5 } } as any );

		expect( wrapper.vm.page ).toBe( 5 );

		wrapper.setProps( { perPage: 3 } );
		await flushPromises();

		expect( wrapper.emitted().change ).toBeFalsy();

		wrapper.setProps( { perPage: 4 } );
		await flushPromises();

		expect( wrapper.emitted().change ).toHaveLength( 1 );
		expect( wrapper.emitted().change[0] ).toHaveLength( 1 );
		expect( wrapper.emitted().change[0][0] ).toBe( 4 );

		wrapper.setProps( { perPage: 2 } );
		await flushPromises();

		expect( wrapper.emitted().change ).toHaveLength( 1 );
	} );
} );
