import { createLocalVue, mount } from '@vue/test-utils';

import Handler from '../../src/classes/handler';
import Settings from '../../src/classes/settings';
import DatatablePagerComponent from '../../src/vue-datatable-pager.vue';
import DatatableComponent from '../../src/vue-datatable.vue';

const localVue = createLocalVue();

beforeEach( () => {
	jest.clearAllMocks();
	localVue.prototype.$datatables = {};
} );
const makeConfig = <T>( propsData: T ) => ( {
	handler: new Handler(),
	localVue,
	propsData,
	settings: new Settings(),
} );
describe( 'Wait for pager', () => {
	it( 'Table should not process rows while waiting for the pager', () => {
		const processRowsMock = jest.spyOn( DatatableComponent.methods, 'processRows' );
		const table = mount( DatatableComponent, makeConfig( {
			columns: [],
			data: [],
			name: 'foo',
			waitForPager: true,
		} ) );

		expect( processRowsMock ).not.toHaveBeenCalled();
	} );
	it( 'Table should process rows once the pager is associated.', done => {
		const processRowsMock = jest.spyOn( DatatableComponent.methods, 'processRows' );
		const table = mount( DatatableComponent, makeConfig( {
			columns: [],
			data: [],
			name: 'bar',
			waitForPager: true,
		} ) );
		const pager = mount( DatatablePagerComponent, makeConfig( {
			table: 'bar',
		} ) );

		table.vm.$nextTick( () => {
			try {
				expect( processRowsMock ).toHaveBeenCalledTimes( 1 );
			} catch ( e ) {
				done( e );
			}
			done();
		} );
	} );
} );
describe( 'No wait for pager', () => {
	it( 'Table should process rows right after initialization', done => {
		const processRowsMock = jest.spyOn( DatatableComponent.methods, 'processRows' );
		const table = mount( DatatableComponent, makeConfig( {
			columns: [],
			data: [],
			name: 'foo',
		} ) );

		table.vm.$nextTick( () => {
			try {
				expect( processRowsMock ).toHaveBeenCalledTimes( 1 );
			} catch ( e ) {
				done( e );
			}
			done();
		} );
	} );
	it( 'Table should process rows once after pager declaration', done => {
		const processRowsMock = jest.spyOn( DatatableComponent.methods, 'processRows' );
		const table = mount( DatatableComponent, makeConfig( {
			columns: [],
			data: [],
			name: 'foo',
		} ) );
		const pager = mount( DatatablePagerComponent, makeConfig( {
			table: 'foo',
		} ) );

		table.vm.$nextTick( () => {
			try {
				expect( processRowsMock ).toHaveBeenCalledTimes( 1 );
			} catch ( e ) {
				done( e );
			}
			done();
		} );
	} );
} );
