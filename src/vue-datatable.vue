<style></style>

<template>
	<table :class="table_class">
		<thead>
			<tr>
				<datatable-header
					v-for="head_column in normalized_columns"
					:column="head_column"
					:settings="settings"
					:direction="getSortDirectionForColumn(head_column)"
					@change="setSortDirectionForColumn"
				></datatable-header>
			</tr>
		</thead>
		<tbody>
			<slot name="rows" v-for="row in processed_rows" :row="row">
			    <tr>
					<datatable-cell
						v-for="column in normalized_columns"
						:column="column"
						:row="row"
						:settings="settings"
					></datatable-cell>
			    </tr>
			</slot>
		</tbody>
	</table>
</template>

<script>
import Column from './classes/column.js';

export default {
	props: {
		columns: [Object, Array],
		data: [Object, Array, String],
		filterBy: {
			type: String,
			default: null
		},
		perPage: {
			type: Number,
			default: null
		},
		page: {
			type: Number,
			default: 1
		},
	},
	data: () => ({
		sort_by: null,
		sort_dir: null,
		processed_rows: [],
	}),
	computed: {
		rows(){
			return this.data.slice(0);
		},
		settings(){
			return this.$options.settings;
		},
		handler(){
			return this.$options.handler;
		},
		normalized_columns(){
			return this.columns.map(function(column){
				return new Column(column);
			});
		},
		table_class(){
			return this.settings.get('table.class');
		},
	},
	methods: {
		getSortDirectionForColumn(column_definition){
			if(this.sort_by !== column_definition){
				return null;
			}

			return this.sort_dir;
		},
		setSortDirectionForColumn(direction, column){
			this.sort_by = column;
			this.sort_dir = direction;
		},
		processRows(){
			let filtered_data = this.handler.filterHandler(
				this.rows,
				this.filterBy,
				this.normalized_columns
			);

			this.$emit('filtered', filtered_data);

			let sorted_rows = this.handler.sortHandler(
				filtered_data,
				this.sort_by,
				this.sort_dir
			);

			let paged_data = this.handler.paginateHandler(
				sorted_rows,
				this.perPage,
				this.page
			);

			this.handler.displayHandler(paged_data, this.setRows);
		},
		setRows(rows){
			this.processed_rows = rows;
		},
	},
	created(){
		this.$watch(function(){
			console.log(this.data);
			return this.data;
		}.bind(this), this.processRows, {deep: true});

		this.$watch('columns', this.processRows);

		this.$watch(function(){
			return this.filterBy + this.perPage + this.page + this.sort_by + this.sort_dir;
		}.bind(this), this.processRows);

		this.processRows();
	},
	handler: null,
	settings: null
}
</script>
