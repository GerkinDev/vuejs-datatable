window.axios = require('axios');

export default {
	data: () => ({
		paginate: false,
		filterable: false,
		sortable: false,
		can_resize: false,
		filter: '',
		sort_by: '',
		sort_dir: 'asc',
		page: 1,
		page_size: 10,
		data: [],
		table: null,
		url: '',
		next_url: '',
		urls: []
	}),
	computed: {
		last_page(){
			return this.urls.length;
		},
		visible_rows(){
			return this.data;
		}
	},
	methods: {
		sortBy(column_id){
			return;
		},
		setPage(page_number, event){
			if(page_number >= this.urls.length){
				this.getRows(this.next_url, function(){
					this.page = page_number;
					this.urls.push(this.next_url);
				}.bind(this));
			}else{
				this.getRows(this.urls[page_number - 1], function(){
					this.page = page_number;
				}.bind(this));
			}

			event.target.blur();
		},
		setTable(table){
			this.table = table;
		},
		setData(data){
			this.urls = [];
			this.url = data;
			this.urls.push(this.url);
			this.getRows(this.url, function(){
				this.urls.push(this.next_url);
			}.bind(this));
		},
		setFilterable(value){
			this.filterable = false;
		},
		setPaginate(value){
			this.paginate = value;
		},
		setSortable(value){
			this.sortable = false;
		},
		getRows(url, callback){
			axios.get(url).then(function(response){
				this.data = response.data.values;
				this.page_size = response.data.pagelen;
				this.next_url = response.data.next;

				if(callback){
					callback();
				}

				console.log(response.data);
			}.bind(this));
		}
	},
	watch: {
		filter(){
			this.page = 1;
		},
		page_size(){
			this.page = 1;
		}
	}
};