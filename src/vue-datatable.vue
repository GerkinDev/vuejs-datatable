<style></style>

<template>
	<table :class="table_class">
		<thead>
			<tr>
				<datatable-header
					v-for="head_column in normalized_columns"
					:column="head_column"
					:settings="settings"
					:direction="sortForColumn(head_column)"
					@change="setSortForColumn"
				></datatable-header>
			</tr>
		</thead>
		<tbody>
			<slot name="rows" v-for="row in visible_rows" :row="row">
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
		display: {
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
		sort_dir: null
	}),
	computed: {
		settings(){
			return this.$options.settings;
		},
		handler(){
			return this.$options.handler;
		},
		rows(){
			return this.data;
		},
		normalized_columns(){
			return this.columns.map(function(column){
				return new Column(column);
			});
		},
		table_class(){
			return this.settings.get('table.class');
		},
		filtered_rows(){
			let filtered_data = this.handler.filterHandler(
				this.rows,
				this.filterBy,
				this.normalized_columns
			);

			this.$emit('filtered', filtered_data);

			return filtered_data;
		},
		sorted_rows(){
			return this.handler.sortHandler(
				this.filtered_rows,
				this.sort_by,
				this.sort_dir
			);
		},
		paginated_rows(){
			return this.handler.paginateHandler(
				this.sorted_rows,
				this.display,
				this.page
			);
		},
		visible_rows(){
			return this.handler.displayHandler(
				this.paginated_rows
			);
		}
	},
	methods: {
		sortForColumn(column_definition){
			if(this.sort_by !== column_definition){
				return null;
			}

			return this.sort_dir;
		},
		setSortForColumn(direction, column){
			this.sort_by = column;
			this.sort_dir = direction;
		}
	},
	handler: null,
	settings: null
}
</script>
