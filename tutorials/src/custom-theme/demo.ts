import Vue from 'vue';
import { TColumnsDefinition, VuejsDatatableFactory } from 'vuejs-datatable';

import { IPeople } from '../utils';

VuejsDatatableFactory.useDefaultType( false )
	.registerTableType( 'datatable', tableType => tableType.mergeSettings( {
		table: {
			class:   'table table-hover table-striped',
			sorting: {
				sortAsc:  '<i class="fas fa-sort-amount-up" title="Sort ascending"></i>',
				sortDesc: '<i class="fas fa-sort-amount-down" title="Sort descending"></i>',
				sortNone: '<i class="fas fa-sort" title="Sort"></i>',
			},
		},
		pager: {
			classes: {
				pager:    'pagination text-center',
				selected: 'active',
			},
			icons: {
				next:     '<i class="fas fa-chevron-right" title="Next page"></i>',
				previous: '<i class="fas fa-chevron-left" title="Previous page"></i>',
			},
		},
	} ) );

// Defined on window
declare var rows: IPeople[];

const app = new Vue( {
	el:   '#demo-app',
	data: {
		filter:  '',
		columns: [
			{ label: 'id', field: 'id' },
			{ label: 'Username', field: 'user.username' },
			{ label: 'First Name', field: 'user.first_name' },
			{ label: 'Last Name', field: 'user.last_name' },
			{ label: 'Email', field: 'user.email' },
			{
				label:         'Address',
				representedAs: row => `${ row.address  }<br />${  row.city  }, ${  row.state }`,
				interpolate:   true,
				sortable:      false,
				filterable:    false,
			},
		] as TColumnsDefinition<IPeople>,
		rows,
		page: 1,
	},
} );
