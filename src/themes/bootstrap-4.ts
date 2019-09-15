import { VuejsDatatableFactory } from 'vuejs-datatable';

VuejsDatatableFactory.registerTableType( 'bootstrap-4-datatable', tableType =>
	tableType.mergeSettings( {
		pager: {
			classes: {
				disabled: 'disabled',
				li: 'page-item',
				pager: 'pagination',
				selected: 'active',
			},
			icons: {
				next: '»',
				previous: '«',
			},
		},
		table: {
			class: 'table',
		},
	} ) );
