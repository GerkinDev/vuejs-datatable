import Vue from 'vue';
import { TColumnsDefinition } from 'vuejs-datatable';

import { IPeople } from '../utils';

declare var rows: IPeople[];
const app = new Vue( {
	el:   '#demo-app',
	data: {
		filter:  '',
		columns: [
			{ label: 'ID', field: 'id', align: 'center', filterable: false },
			{ label: 'Username', field: 'user.username' },
			{ label: 'First Name', field: 'user.first_name' },
			{ label: 'Last Name', field: 'user.last_name' },
			{ label: 'Email', field: 'user.email', align: 'right', sortable: false },
			{ label: 'Address', representedAs: row => `${ row.address  }, ${  row.city  }, ${  row.state }`, align: 'right', sortable: false },
		] as TColumnsDefinition<IPeople>,
		rows,
	},
} );
