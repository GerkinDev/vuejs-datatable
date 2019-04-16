// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';

jest.mock( '../../../classes/table-type' );
jest.mock( '../vue-datatable-pager' );
// @ts-ignore
import { setting, TableType } from '../../../classes/table-type';
import { namespaceEvent } from '../../../utils';
import { VueDatatablePagerButton } from './vue-datatable-pager-button';

const localVue = createLocalVue();
const setPageEvent = namespaceEvent( 'set-page' );
beforeEach( () => {
	jest.clearAllMocks();
} );

describe( 'Events', () => {
	it( 'click emits set-page event on parent', () => {
		const wrapper = mount( VueDatatablePagerButton, {
			localVue,
			parentComponent: {} as ComponentOptions<Vue>,
			propsData: { value: 42 },
			provide: { 'table-type': new TableType<any>( 'tmp' ) },
		} );
		const mockParentEmit = jest.spyOn( wrapper.vm.$parent, '$emit' );

		wrapper.find( 'li' ).trigger( 'click' );
		expect( mockParentEmit ).toHaveBeenCalledTimes( 1 );
		expect( mockParentEmit ).toHaveBeenCalledWith( setPageEvent, 42 );
	} );
	it( 'click when disabled should not emit set-page event on parent', () => {
		const wrapper = mount( VueDatatablePagerButton, {
			localVue,
			parentComponent: {} as ComponentOptions<Vue>,
			propsData: { value: 42, disabled: true },
			provide: { 'table-type': new TableType<any>( 'tmp' ) },
		} );
		const mockParentEmit = jest.spyOn( wrapper.vm.$parent, '$emit' );

		wrapper.find( 'li' ).trigger( 'click' );
		expect( mockParentEmit ).not.toHaveBeenCalled();
	} );
} );

describe( 'Template', () => {
	describe( 'HTML & slots', () => {
		it( 'builds base HTML', () => {
			const wrapper = mount( VueDatatablePagerButton, {
				localVue,
				parentComponent: {} as ComponentOptions<Vue>,
				provide: { 'table-type': new TableType<any>( 'tmp' ) },
			} );

			expect( wrapper.element.textContent.trim() ).toBe( '' );
			expect( wrapper.element.nodeName ).toBe( 'LI' );
			expect( wrapper.element.children.length ).toBe( 0 );
		} );
		it( 'displays passed value', () => {
			const wrapper = mount( VueDatatablePagerButton, {
				localVue,
				parentComponent: {} as ComponentOptions<Vue>,
				propsData: { value: 1 },
				provide: { 'table-type': new TableType<any>( 'tmp' ) },
			} );

			expect( wrapper.element.textContent.trim() ).toBe( '1' );
		} );
		it( 'slot overrides value', () => {
			const wrapper = mount( VueDatatablePagerButton, {
				localVue,
				parentComponent: {} as ComponentOptions<Vue>,
				propsData: { value: 1 },
				provide: { 'table-type': new TableType<any>( 'tmp' ) },
				slots: { default: 'foo' },
			} );

			expect( wrapper.element.textContent.trim() ).toBe( 'foo' );
		} );
	} );
	describe( 'Classes', () => {
		it( 'uses the correct selected class', () => {
			setting.mockImplementation( p => p === 'pager.classes.li' ? 'LI' : 'SELECTED' );
			const wrapper = mount( VueDatatablePagerButton, {
				localVue,
				parentComponent: {} as ComponentOptions<Vue>,
				propsData: { value: 1, selected: true },
				provide: { 'table-type': new TableType<any>( 'tmp' ) },
			} );

			expect( setting ).toHaveBeenCalledTimes( 2 );
			expect( setting ).toHaveBeenCalledWith( 'pager.classes.li' );
			expect( wrapper.element.classList ).toContain( 'LI' );
			expect( setting ).toHaveBeenCalledWith( 'pager.classes.selected' );
			expect( wrapper.element.classList ).toContain( 'SELECTED' );
		} );

		it( 'uses the correct disabled class', () => {
			setting.mockImplementation( p => p === 'pager.classes.li' ? 'LI' : 'DISABLED' );
			const wrapper = mount( VueDatatablePagerButton, {
				localVue,
				parentComponent: {} as ComponentOptions<Vue>,
				propsData: { value: 1, disabled: true },
				provide: { 'table-type': new TableType<any>( 'tmp' ) },
			} );

			expect( setting ).toHaveBeenCalledTimes( 2 );
			expect( setting ).toHaveBeenCalledWith( 'pager.classes.li' );
			expect( wrapper.element.classList ).toContain( 'LI' );
			expect( setting ).toHaveBeenCalledWith( 'pager.classes.disabled' );
			expect( wrapper.element.classList ).toContain( 'DISABLED' );
		} );
	} );
} );
