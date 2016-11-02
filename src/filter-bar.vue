<template>
	<div class="row form-inline" style="padding: 15px 30px;">
		<div class="col-xs-12 col-sm-3">
			<div v-if="filterable" class="form-group">
				<label for="filter" class="sr-only">Filter</label>
				<input type="text" id="filter" class="form-control" v-model="filter_text" @change.stop="" placeholder="Filter">
			</div>
		</div>
		<div class="col-xs-12 col-sm-9 text-right">

			<div v-if="paginate" class="form-group">
				<label for="filter">Page Size</label>
				<select v-model="page_size" class="form-control" @change.stop="">
					<option v-for="size in size_options" :value="size">{{ size }}</option>
				</select>
			</div>

			<span v-if="paginate" class="btn-group">
				<button class="btn btn-default" v-if="page_number - 3 >= 1" @click="setPage(1, $event)">1</button>
				<button class="btn btn-default" v-if="page_number - 4 >= 1" disabled>...</button>


				<button class="btn btn-default" v-if="page_number - 2 >= 1" @click="setPage(page_number - 2, $event)">{{ page_number - 2 }}</button>
				<button class="btn btn-default" v-if="page_number - 1 >= 1" @click="setPage(page_number - 1, $event)">{{ page_number - 1 }}</button>


				<button class="btn btn-default active">{{ page_number }}</button>


				<button class="btn btn-default" v-if="page_number + 1 <= last_page" @click="setPage(page_number + 1, $event)">{{ page_number + 1 }}</button>
				<button class="btn btn-default" v-if="page_number + 2 <= last_page" @click="setPage(page_number + 2, $event)">{{ page_number + 2 }}</button>


				<button class="btn btn-default" v-if="page_number + 4 <= last_page" disabled>...</button>
				<button class="btn btn-default" v-if="page_number + 3 <= last_page" @click="setPage(last_page, $event)">{{ last_page }}</button>
			</span>
		</div>
	</div>
</template>

<script>
module.exports = {
	props: {
		rows: [Object, Array],
		filterable: {
			type: Boolean,
			default: false
		},
		paginate: {
			type: Boolean,
			default: false
		}
	},
	data: function(){return {
		filter_text: '',
		page_size: 10,
		page_number: 1,
		size_options: [10, 25, 50, 100]
	}},
	computed: {
		filtered_rows: function(){
			var rows = this.rows;

			if(this.filterable && this.filter_text){
				var filter_words = this.filter_text.split(' ');

				return rows.filter(function(row){

					for(var f in filter_words){
						var filter_word = filter_words[f];

						if(typeof filter_word.toLowerCase === 'function'){
							filter_word = filter_word.toLowerCase();
						}

						var pass = false;

						for(var c in row){
							var column = row[c];

							if(column === null){
								continue;
							}

							column = '' + column + '';

							if(typeof column.toLowerCase === 'function'){
								column = column.toLowerCase();
							}

							if(column.indexOf(filter_word) !== -1){
								var pass = true;
							}
						}

						if(!pass){
							return false;
						}
					}

					return true;
				}.bind(this));
			}

			return rows;
		},
		paginated_rows: function(){
			if(this.paginate){
				var beginning = this.page_size * (this.page_number - 1);
				return this.filtered_rows.slice(beginning, beginning + this.page_size);
			}

			return this.filtered_rows;
		},
		last_page: function(){
			return Math.ceil(this.filtered_rows.length / this.page_size);
		}
	},
	methods: {
		setPage: function(page_number, event){
			this.page_number = page_number;
			event.target.blur();
		},
	},
	watch: {
		paginated_rows: function(){
			this.$emit('change', this.paginated_rows);
		},
		filter_text: function(){
			this.page_number = 1;
		},
		page_size: function(){
			this.page_number = 1;
		}
	},
	created: function(){
		this.$emit('change', this.paginated_rows);
	}
}
</script>