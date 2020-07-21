// tslint:disable: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import { DatatableFactory, ESortDir } from '../../src/classes';
import { sampleData } from './sample-data';

// tslint:disable: no-string-literal

interface ISampleData {
	id: number;
	title: string;
}
describe( 'Sort', () => {
	it( 'Should sort ascending on text', async () => {
		const localVue = createLocalVue();
		const factory = new DatatableFactory();
		localVue.use( factory );
		const tableType = factory.getTableType();
		const datatable = mount( tableType.getTableDefinition(), { localVue, propsData: {
			columns: [
				{ label: 'Number', field: 'number' },
				{ label: 'Text', field: 'text' },
			],
			data: sampleData,
			name: 'my-table',
		} } );
		await flushPromises();
		const columns = datatable.vm.normalizedColumns;
		const textColumn = columns.find( c => c.label === 'Text' );
		datatable.vm.setSortDirectionForColumn( ESortDir.Asc, textColumn );
		const table = datatable.element.querySelector('table');
		console.log(table, datatable.element)
	} );
} );
