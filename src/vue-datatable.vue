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
			<slot v-for="row in processed_rows" :row="row">
			    <tr>
					<datatable-cell
						v-for="column in normalized_columns"
						:column="column"
						:row="row"
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
		name: {
			type: String,
			default: 'default'
		},
		columns: [Object, Array],
		data: [Object, Array, String],
		filterBy: {
			type: String,
			default: null
		},
	},
	data: () => ({
		sort_by: null,
		sort_dir: null,
		total_rows: 0,
		page: 1,
		per_page: null,
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

			let sorted_data = this.handler.sortHandler(
				filtered_data,
				this.sort_by,
				this.sort_dir
			);

			let paged_data = this.handler.paginateHandler(
				sorted_data,
				this.per_page,
				this.page
			);

			this.handler.displayHandler(
				paged_data,
				{
					filtered_data: filtered_data,
					sorted_data: sorted_data,
					paged_data: paged_data,
				},
				this.setRows,
				this.setTotalRowCount
			);
		},
		setRows(rows){
			this.processed_rows = rows;
		},
		setTotalRowCount(value){
			this.total_rows = value;
		},
	},
	created(){
		Vue.$datatables[this.name] = this;
		this.$root.$emit('table.ready', this.name);

		this.$watch(function(){
			return this.data;
		}.bind(this), this.processRows, {deep: true});

		this.$watch('columns', this.processRows);

		this.$watch(function(){
			return this.filterBy + this.per_page + this.page + this.sort_by + this.sort_dir;
		}.bind(this), this.processRows);

		this.processRows();
	},
	handler: null,
	settings: null
}
</script>
