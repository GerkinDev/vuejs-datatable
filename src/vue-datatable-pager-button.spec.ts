// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';

jest.mock( './classes/settings' );
jest.mock( './vue-datatable-pager.vue' );
import Settings, { get } from './classes/settings';
import DatatablePagerButton from './vue-datatable-pager-button.vue';
import DatatablePagerComponent from './vue-datatable-pager.vue';

const localVue = createLocalVue();
beforeEach( () => {
	jest.clearAllMocks();
} );
it( 'builds base HTML', () => {
	const wrapper = mount( DatatablePagerButton, { localVue, parentComponent: DatatablePagerComponent } );

	expect( wrapper.element.textContent.trim() ).toBe( '' );
	expect( wrapper.element.nodeName ).toBe( 'LI' );
	expect( wrapper.element.children.length ).toBe( 0 );
} );

it( 'displays passed value', () => {
	const wrapper = mount( DatatablePagerButton, { localVue, propsData: { value: 1 }, parentComponent: DatatablePagerComponent } );

	expect( wrapper.element.textContent.trim() ).toBe( '1' );
} );

it( 'slot overrides value', () => {
	const wrapper = mount( DatatablePagerButton, {
		localVue,
		parentComponent: DatatablePagerComponent,
		propsData: { value: 1 },
		slots: { default: 'foo' },
	} );

	expect( wrapper.element.textContent.trim() ).toBe( 'foo' );
} );

it( 'click emits click event', () => {
	const wrapper = mount( DatatablePagerButton, {
		localVue,
		parentComponent: DatatablePagerComponent,
		propsData: { value: 42 },
	} );

	wrapper.find( 'li' ).trigger( 'click' );
	expect( wrapper.emitted().click ).toHaveLength( 1 );
	expect( wrapper.emitted().click[0] ).toHaveLength( 1 );
	expect( wrapper.emitted().click[0][0] ).toBe( 42 );
} );
it( 'click when disabled should not emit click event', () => {
	const wrapper = mount( DatatablePagerButton, {
		localVue,
		parentComponent: DatatablePagerComponent,
		propsData: { value: 42, disabled: true },
	} );

	wrapper.find( 'li' ).trigger( 'click' );
	expect( wrapper.emitted().click ).toBeFalsy();
} );

it( 'uses the correct selected class', () => {
	get.mockImplementation( p => p === 'pager.classes.li' ? 'LI' : 'SELECTED' );
	const wrapper = mount( DatatablePagerButton, { localVue, propsData: { value: 1, selected: true }, parentComponent: DatatablePagerComponent } );

	expect( get ).toHaveBeenCalledTimes( 2 );
	expect( get ).toHaveBeenCalledWith( 'pager.classes.li' );
	expect( wrapper.element.classList ).toContain( 'LI' );
	expect( get ).toHaveBeenCalledWith( 'pager.classes.selected' );
	expect( wrapper.element.classList ).toContain( 'SELECTED' );
} );

it( 'uses the correct disabled class', () => {
	get.mockImplementation( p => p === 'pager.classes.li' ? 'LI' : 'DISABLED' );
	const wrapper = mount( DatatablePagerButton, { localVue, propsData: { value: 1, disabled: true }, parentComponent: DatatablePagerComponent } );

	expect( get ).toHaveBeenCalledTimes( 2 );
	expect( get ).toHaveBeenCalledWith( 'pager.classes.li' );
	expect( wrapper.element.classList ).toContain( 'LI' );
	expect( get ).toHaveBeenCalledWith( 'pager.classes.disabled' );
	expect( wrapper.element.classList ).toContain( 'DISABLED' );
} );
