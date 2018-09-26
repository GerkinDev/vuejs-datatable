import Vue from 'vue';
import DatatableFactory from '../../dist/vuejs-datatable.esm';

DatatableFactory.useDefaultType(false)
	.registerTableType('datatable', function(table_type){
		table_type.mergeSettings({
			table: {
				class: 'hover table-scroll',
				sorting: {
                    classes: {
                        canSort: ['sort'],
                        sortNone: ['fa', 'fa-sort'],
                        sortAsc: ['fa', 'fa-sort-asc'],
                        sortDesc: ['fa', 'fa-sort-desc'],
                    }
                }
			},
			pager: {
                classes: {
					pager: 'pagination text-center',
                    selected: 'current'
                }
            }
		});
	}
);

Vue.use(DatatableFactory);


Vue.config.debug = true;
Vue.config.devtools = true;

window.vm = new Vue({
	el: '.grid-container',
	data: {
		filter: '',
		columns: [
			{label: 'id', field: 'id'},
			{label: 'Username', field: 'user.username'},
			{label: 'First Name', field: 'user.first_name'},
			{label: 'Last Name', field: 'user.last_name'},
			{label: 'Email', field: 'user.email'},
			{label: 'address', representedAs: function(row){
				return row.address + '<br />' + row.city + ', ' + row.state;
			}, interpolate: true, sortable: false, filterable: false}
		],
		rows: window.rows,
		page: 1,
	}
});
