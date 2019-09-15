// tslint:disable: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import { inspect } from 'util';
import { DatatableFactory } from '../../src/classes';
import { VueDatatablePagerButton } from '../../src/components/vue-datatable-pager/vue-datatable-pager-button/vue-datatable-pager-button';
import { VueDatatable } from '../../src/components/vue-datatable/vue-datatable';

// tslint:disable: no-string-literal

interface ISampleData {
	id: number;
	title: string;
}
const sampleData = require( './sample-data.json' ) as ISampleData[];
describe( 'Pagination control', () => {
	it( 'Should change page', async () => {
		const localVue = createLocalVue();
		const factory = new DatatableFactory();
		localVue.use( factory );
		const tableType = factory.getTableType();
		const datatable = mount( tableType.getTableDefinition(), { localVue, propsData: {
			columns: [
				{ label: 'ID', field: 'id' },
				{ label: 'Title', field: 'title' },
			],
			data: sampleData,
			perPage: 5,
			name: 'my-table',
		} } );
		const pagers = [
			mount( tableType.getPagerDefinition(), { localVue, propsData: { table: 'my-table', type: 'short' }} ),
			mount( tableType.getPagerDefinition(), { localVue, propsData: { table: 'my-table', type: 'long' }} ),
		];
		await flushPromises();
		expect( datatable.vm.page ).toBe( 1 );
		expect( datatable.vm['perPage'] ).toBe( 5 );
		expect( datatable.vm.displayedRows ).toEqual( sampleData.slice( 0, 5 ) );
		expect( datatable.vm['totalPages'] ).toBe( 5 );

		const buttonsPagerBefore0 = pagers[0].findAll( VueDatatablePagerButton );
		expect( buttonsPagerBefore0.wrappers ).toHaveLength( 2 );
		expect( buttonsPagerBefore0.wrappers[0].vm['value'] ).toBe( 1 );
		expect( buttonsPagerBefore0.wrappers[0].vm['selected'] ).toBe( true );
		expect( buttonsPagerBefore0.wrappers[1].vm['value'] ).toBe( 2 );
		expect( buttonsPagerBefore0.wrappers[1].vm['selected'] ).toBe( false );
		expect( buttonsPagerBefore0.wrappers[1].vm.$slots ).toHaveProperty( 'default' );
		expect( buttonsPagerBefore0.wrappers[1].vm.$slots.default ).toHaveLength( 1 );
		expect( buttonsPagerBefore0.wrappers[1].vm.$slots.default[0].elm.textContent ).toBe( '>' );

		const buttonsPagerBefore1 = pagers[1].findAll( VueDatatablePagerButton );
		expect( buttonsPagerBefore1.wrappers ).toHaveLength( 5 );
		expect( buttonsPagerBefore1.wrappers[0].vm['value'] ).toBe( 1 );
		expect( buttonsPagerBefore1.wrappers[0].vm['selected'] ).toBe( true );
		expect( buttonsPagerBefore1.wrappers[1].vm['value'] ).toBe( 2 );
		expect( buttonsPagerBefore1.wrappers[1].vm['selected'] ).toBe( false );
		expect( buttonsPagerBefore1.wrappers[2].vm['value'] ).toBe( 3 );
		expect( buttonsPagerBefore1.wrappers[2].vm['selected'] ).toBe( false );
		expect( buttonsPagerBefore1.wrappers[3].vm['value'] ).toBe( 4 );
		expect( buttonsPagerBefore1.wrappers[3].vm['selected'] ).toBe( false );
		expect( buttonsPagerBefore1.wrappers[4].vm['value'] ).toBe( 5 );
		expect( buttonsPagerBefore1.wrappers[4].vm['selected'] ).toBe( false );

		datatable.vm.page = 3;
		await flushPromises();
		expect( datatable.vm.displayedRows ).toEqual( sampleData.slice( 10, 15 ) );

		const buttonsPagerAfter0 = pagers[0].findAll( VueDatatablePagerButton );
		expect( buttonsPagerAfter0.wrappers ).toHaveLength( 3 );
		expect( buttonsPagerAfter0.wrappers[0].vm['value'] ).toBe( 2 );
		expect( buttonsPagerAfter0.wrappers[0].vm['selected'] ).toBe( false );
		expect( buttonsPagerAfter0.wrappers[0].vm.$slots ).toHaveProperty( 'default' );
		expect( buttonsPagerAfter0.wrappers[0].vm.$slots.default ).toHaveLength( 1 );
		expect( buttonsPagerAfter0.wrappers[0].vm.$slots.default[0].elm.textContent ).toBe( '<' );
		expect( buttonsPagerAfter0.wrappers[1].vm['value'] ).toBe( 3 );
		expect( buttonsPagerAfter0.wrappers[1].vm['selected'] ).toBe( true );
		expect( buttonsPagerAfter0.wrappers[2].vm['value'] ).toBe( 4 );
		expect( buttonsPagerAfter0.wrappers[2].vm['selected'] ).toBe( false );
		expect( buttonsPagerAfter0.wrappers[2].vm.$slots ).toHaveProperty( 'default' );
		expect( buttonsPagerAfter0.wrappers[2].vm.$slots.default ).toHaveLength( 1 );
		expect( buttonsPagerAfter0.wrappers[2].vm.$slots.default[0].elm.textContent ).toBe( '>' );

		const buttonsPagerAfter1 = pagers[1].findAll( VueDatatablePagerButton );
		expect( buttonsPagerAfter1.wrappers ).toHaveLength( 5 );
		expect( buttonsPagerAfter1.wrappers[0].vm['value'] ).toBe( 1 );
		expect( buttonsPagerAfter1.wrappers[0].vm['selected'] ).toBe( false );
		expect( buttonsPagerAfter1.wrappers[1].vm['value'] ).toBe( 2 );
		expect( buttonsPagerAfter1.wrappers[1].vm['selected'] ).toBe( false );
		expect( buttonsPagerAfter1.wrappers[2].vm['value'] ).toBe( 3 );
		expect( buttonsPagerAfter1.wrappers[2].vm['selected'] ).toBe( true );
		expect( buttonsPagerAfter1.wrappers[3].vm['value'] ).toBe( 4 );
		expect( buttonsPagerAfter1.wrappers[3].vm['selected'] ).toBe( false );
		expect( buttonsPagerAfter1.wrappers[4].vm['value'] ).toBe( 5 );
		expect( buttonsPagerAfter1.wrappers[4].vm['selected'] ).toBe( false );
	} );
} );
