import objectPath from 'object-path';

export default {
	data() { 
		return {
			paginate: false,
			filterable: false,
			sortable: false,
			can_resize: true,
			filter: '',
			sort_by: '',
			sort_dir: 'asc',
			page: 1,
			page_size: 10,
			data: [],
			table: null
		}
	},
	computed: {
		last_page(){
			return Math.ceil(this.filtered_rows.length / this.page_size);
		},
		filtered_rows(){
			var rows = this.data;

			if(this.filterable && this.filter){
				var filter_words = this.filter.split(' ');

				return rows.filter(function(row){

					for(var f in filter_words){
						var filter_word = filter_words[f];

						if(typeof filter_word.toLowerCase === 'function'){
							filter_word = filter_word.toLowerCase();
						}

						var pass = false;

						for(var i in this.table.columns){
							var column_definition = this.table.column_props[i];

							if(!column_definition.filterable){
								continue;
							}

							var column_text = this.getColumnValue(row, column_definition);

							if(!column_text){
								continue;
							}

							column_text = ('' + column_text + '').trim();

							if(typeof column_text.toLowerCase === 'function'){
								column_text = column_text.toLowerCase();
							}

							if(column_text.indexOf(filter_word) !== -1){
								var pass = true;
							}
						}

						if(!pass){
							return false;
						}
					}

					return true;
				}, this);
			}

			return rows.filter(function(row){return true;});
		},
		sorted_rows(){
			var column = this.table.column_props[this.sort_by];

			if(!column || this.sort_by === null){
				return this.filtered_rows;
			}

			return this.filtered_rows.sort(function(a,b){
				var value_a = this.getColumnValue(a, column);
				var value_b = this.getColumnValue(b, column);

				if(value_a == value_b){
					return 0;
				}

				var sort_val = value_a > value_b ? 1 : -1;

				if(this.sort_dir === 'dsc'){
					sort_val *= -1;
				}

				return sort_val;
			}.bind(this));
		},
		visible_rows(){
			if(this.paginate){
				var beginning = this.page_size * (this.page - 1);
				return this.sorted_rows.slice(beginning, beginning + this.page_size);
			}

			return this.sorted_rows;
		}
	},
	methods: {
		sortBy(column_id){
			if(this.sort_by === column_id){
				switch(this.sort_dir){
					case null:
						this.sort_dir = 'asc';
						break;
					case 'asc':
						this.sort_dir = 'dsc';
						break;
					case 'dsc':
						this.sort_dir = null;
						break;
				}

				return;
			}

			this.sort_by = column_id;
			this.sort_dir = 'asc';
		},
		getColumnValue(row, column){
			if(column.component){
				var component_definition = this.$root.$options.components[column.component];
				var plain_text_function = component_definition.options.asPlainText;

				if(plain_text_function){
					return plain_text_function(row);
				}
			}

			if(column.callback){
				return column.callback(row);
			}

			if(column.field){
				return objectPath.get(row, column.field);
			}

			return null;
		},
		setPage(page_number, event){
			this.page = page_number;
			event.target.blur();
		},
		setTable(table){
			this.table = table;
		},
		setData(data){
			this.data = data;
		},
		setFilterable(value){
			this.filterable = value;
		},
		setPaginate(value){
			this.paginate = value;
		},
		setSortable(value){
			this.sortable = value;
		},
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