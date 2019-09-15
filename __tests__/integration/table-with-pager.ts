import { createLocalVue, mount } from '@vue/test-utils';

import { TableType } from '../../src/classes';
import { DefaultHandler } from '../../src/classes/handlers/default-handler';
import { Settings } from '../../src/classes/settings';
import { VueDatatablePager } from '../../src/components/vue-datatable-pager/vue-datatable-pager';
import { VueDatatable } from '../../src/components/vue-datatable/vue-datatable';
import { mountVueDatatable, mountVueDatatablePager } from '../helpers/mount-mixin-components';

const localVue = createLocalVue();

beforeEach( () => {
	jest.clearAllMocks();
	localVue.prototype.$datatables = {};
} );
describe( 'Wait for pager', () => {
	it( 'Table should not process rows while waiting for the pager', () => {
		const processRowsMock = jest.spyOn( ( VueDatatable as any ).extendOptions.methods, 'processRows' as any );
		const tableType = new TableType<any>( 'bar' );
		const table = mountVueDatatable( false, tableType, {
			localVue,
			propsData: {
				columns: [],
				data: [],
				name: 'foo',
				waitForPager: true,
			},
		} );

		expect( processRowsMock ).not.toHaveBeenCalled();
	} );
	it( 'Table should process rows once the pager is associated.', done => {
		const processRowsMock = jest.spyOn( ( VueDatatable as any ).extendOptions.methods, 'processRows' as any );
		const tableType = new TableType<any>( 'bar' );
		const table = mountVueDatatable( false, tableType, {
			localVue,
			propsData: {
				columns: [],
				data: [],
				name: 'bar',
				waitForPager: true,
			},
		} );
		const pager = mountVueDatatablePager( false, tableType, {
			localVue,
			propsData: {
				table: 'bar',
			},
		} );

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
		const processRowsMock = jest.spyOn( ( VueDatatable as any ).extendOptions.methods, 'processRows' as any );
		const tableType = new TableType<any>( 'bar' );
		const table = mountVueDatatable( false, tableType, {
			localVue,
			propsData: {
				columns: [],
				data: [],
				name: 'foo',
			},
		} );

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
		const processRowsMock = jest.spyOn( ( VueDatatable as any ).extendOptions.methods, 'processRows' as any );
		const tableType = new TableType<any>( 'bar' );
		const table = mountVueDatatable( false, tableType, {
			localVue,
			propsData: {
				columns: [],
				data: [],
				name: 'foo',
			},
		} );
		const pager = mountVueDatatablePager( false, tableType, {
			localVue,
			propsData: {
				table: 'foo',
			},
		} );

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
