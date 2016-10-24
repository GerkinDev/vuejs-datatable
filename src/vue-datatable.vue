<style></style>

<template>
	<div class="row">
		<div class="col-xs-12">
			
			<div v-if="filterable || paginate" class="row">
				<div class="col-xs-12 form-inline" style="padding: 15px 30px;">
					
					<div v-if="filterable" class="form-group">
						<label for="filter">Filter</label>
						<input type="text" id="filter" class="form-control" v-model="filter_text">
					</div>

					<div v-if="paginate" class="btn-group pull-right">
						<button class="btn btn-default" v-if="page_number - 3 >= 1" @click="page_number = 1">1</button>
						<button class="btn btn-default" v-if="page_number - 4 >= 1" disabled>...</button>


						<button class="btn btn-default" v-if="page_number - 2 >= 1" @click="page_number -= 2">{{ page_number - 2 }}</button>
						<button class="btn btn-default" v-if="page_number - 1 >= 1" @click="page_number -= 1">{{ page_number - 1 }}</button>


						<button class="btn btn-default active">{{ page_number }}</button>


						<button class="btn btn-default" v-if="page_number + 1 <= last_page" @click="page_number += 1">{{ page_number + 1 }}</button>
						<button class="btn btn-default" v-if="page_number + 2 <= last_page" @click="page_number += 2">{{ page_number + 2 }}</button>


						<button class="btn btn-default" v-if="page_number + 4 <= last_page" disabled>...</button>
						<button class="btn btn-default" v-if="page_number + 3 <= last_page" @click="page_number = last_page">{{ last_page }}</button>
					</div>
				</div>
			</div>


			<table class="table table-hover table-striped">
				<thead>
					<tr>
						<th v-for="column in columns">{{ column.label }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in paginated_rows">
						<td v-for="column in columns">
							<span v-if="column.field">{{ row[column.field] }}</span>
							<span v-if="column.callback">{{ column.callback(row) }}</span>
							<component v-if="column.component" :is="column.component" :row="row"></component>
						</td>
					</tr>
				</tbody>
			</table>


			<div v-if="filterable || paginate" class="row">
				<div class="col-xs-12 form-inline" style="padding: 15px 30px;">
					
					<div v-if="filterable" class="form-group">
						<label for="filter">Filter</label>
						<input type="text" id="filter" class="form-control" v-model="filter_text">
					</div>

					<div v-if="paginate" class="btn-group pull-right">
						<button class="btn btn-default" v-if="page_number - 3 >= 1" @click="page_number = 1">1</button>
						<button class="btn btn-default" v-if="page_number - 4 >= 1" disabled>...</button>


						<button class="btn btn-default" v-if="page_number - 2 >= 1" @click="page_number -= 2">{{ page_number - 2 }}</button>
						<button class="btn btn-default" v-if="page_number - 1 >= 1" @click="page_number -= 1">{{ page_number - 1 }}</button>


						<button class="btn btn-default active">{{ page_number }}</button>


						<button class="btn btn-default" v-if="page_number + 1 <= last_page" @click="page_number += 1">{{ page_number + 1 }}</button>
						<button class="btn btn-default" v-if="page_number + 2 <= last_page" @click="page_number += 2">{{ page_number + 2 }}</button>


						<button class="btn btn-default" v-if="page_number + 4 <= last_page" disabled>...</button>
						<button class="btn btn-default" v-if="page_number + 3 <= last_page" @click="page_number = last_page">{{ last_page }}</button>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
module.exports = {
	props: {
		columns: [Object, Array],
		rows: [Object, Array],
		filterable: {
			type: Boolean,
			default: false
		},
		paginate: {
			type: Boolean,
			default: false
		},
		pageSize: {
			type: Number,
			default: 10
		}
	},
	data: function(){return {
		filter_text: '',
		page_number: 1
	}},
	computed: {
		filtered_rows: function(){
			var rows = this.rows;

			if(this.filter_text){
				var filter_words = this.filter_text.split(' ');

				return rows.filter(function(row){

					for(var f in filter_words){
						var filter_word = filter_words[f].toLowerCase();
						var pass = false;

						for(var c in row){
							var column = row[c];

							if(column === null){
								continue;
							}

							column = column.toLowerCase();

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
				var beginning = this.pageSize * (this.page_number - 1);
				return this.filtered_rows.slice(beginning, beginning + this.pageSize);
			}

			return this.filtered_rows;
		},
		last_page: function(){
			return Math.ceil(this.filtered_rows.length / this.pageSize);
		}
	}
}
</script>