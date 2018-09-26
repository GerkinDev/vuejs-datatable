import Vue from 'vue';
import { get } from 'axios';
import DatatableFactory from '../../dist/vuejs-datatable.esm';

DatatableFactory.registerTableType('ajaxtable', function(table_type){
	table_type.setFilterHandler(function(url, filter_by, columns){
		if(url.indexOf('?') === -1){
			url += '?';
		}

		if(filter_by){
			url += '&q=' + filter_by;
		}

		url = url.replace('?&', '?');

		return url;
	});
	table_type.setSortHandler(function(filtered_url, sort_column, sort_dir){
		if(sort_column && sort_dir){
			filtered_url += '&_sort=' + sort_column.field;
			filtered_url += '&_order=' + sort_dir;
		}

		filtered_url = filtered_url.replace('?&', '?');

		return filtered_url;
	});
	table_type.setPaginateHandler(function(sorted_url, page_count, page_number){
		sorted_url += '&_page=' + page_number;
		sorted_url += '&_limit=' + page_count;

		sorted_url = sorted_url.replace('?&', '?');

		return sorted_url;
	});
	table_type.setDisplayHandler(function(processed_data, process_steps, setRows, setTotalRowCount){
		get(processed_data).then(function(response){
			let total_rows = response.headers['x-total-count'] * 1;

			setTotalRowCount(total_rows);
			setRows(response.data);
		});
	});
});

Vue.use(DatatableFactory);


Vue.config.debug = true;
Vue.config.devtools = true;

window.vm = new Vue({
	el: '.container',
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
		url: 'http://localhost:3000/profiles/',
		page: 1,
	}
});
