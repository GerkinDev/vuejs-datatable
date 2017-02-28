window.Vue = require('vue');


Vue.config.debug = true;
Vue.config.devtools = true;

Vue.component('datatable', require('../../src/vue-datatable.vue'));

import ajax_store from './ajaxstore.js';

window.vm = new Vue({
	el: '.container',
	data: {
		columns: [
			{label: 'Repository', field: 'full_name'},
			{label: 'Description', field: 'description'},
			{label: 'Owner', callback: function(row){
				return row.owner.display_name;
			}},
			{label: 'size', field: 'size', filterable: false}
		],
		ajax_store: ajax_store
	}
});