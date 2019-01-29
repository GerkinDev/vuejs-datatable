<style></style>

<template>
	<table :class="tableClass">
		<thead>
			<tr>
				<datatable-header
					v-for="(head_column, i) in normalizedColumns"
					:key="i"
					:column="head_column"
					:settings="settings"
					:direction="getSortDirectionForColumn(head_column)"
					@change="setSortDirectionForColumn" />
			</tr>
		</thead>
		<tbody>
			<slot
				v-for="(row, i) in processedRows"
				:row="row"
				:columns="normalizedColumns">
				<tr
					:key="i"
					:class="getRowClasses(row)">
					<datatable-cell
						v-for="(column, j) in normalizedColumns"
						:key="j"
						:column="column"
						:row="row" />
				</tr>
			</slot>
			<tr v-if="processedRows.length == 0">
				<td :colspan="normalizedColumns.length">
					<slot name="no-results" />
				</td>
			</tr>
		</tbody>
		<tfoot v-if="$slots.footer || $scopedSlots.footer">
			<slot
				name="footer"
				:rows="processedRows" />
		</tfoot>
	</table>
</template>

<script>
import Column from './classes/column.js';

export default {
	props: {
		name: {
			type:    String,
			default: 'default',
		},
		columns:  [ Object, Array ],
		data:     [ Object, Array, String, Function ],
		filterBy: {
			type:    [ String, Array ],
			default: null,
		},
		rowClasses: {
			type:    [ String, Array, Object, Function ],
			default: null,
		},
	},
	data: () => ({
		sortBy:        null,
		sortDir:       null,
		totalRows:     0,
		page:          1,
		perPage:       null,
		processedRows: [],
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
		normalizedColumns(){
			return this.columns.map(column => new Column(column));
		},
		tableClass(){
			return this.settings.get('table.class');
		},
	},
	created(){
		this.$datatables[this.name] = this;
		this.$root.$emit('table.ready', this.name);

		this.$watch(() => this.data, this.processRows, {deep: true});

		this.$watch('columns', this.processRows);

		this.$watch(() => this.filterBy + this.perPage + this.page + this.sortBy + this.sortDir, this.processRows);

		this.processRows();
	},
	methods: {
		getSortDirectionForColumn(columnDefinition){
			if (this.sortBy !== columnDefinition){
				return null;
			}

			return this.sortDir;
		},
		setSortDirectionForColumn(direction, column){
			this.sortBy = column;
			this.sortDir = direction;
		},
		processRows(){
			if (typeof this.data === 'function'){
				const params = {
					filter:     this.filterBy,
					sortBy:     this.sortBy ? this.sortBy.field : null,
					sortDir:    this.sortDir,
					pageLength: this.perPage,
					pageNumber: this.page,
				};

				this.data(params, (rows, rowCount) => {
					this.setRows(rows);
					this.setTotalRowCount(rowCount);
				});

				return;
			}

			const filteredData = this.handler.filterHandler(
				this.rows,
				this.filterBy,
				this.normalizedColumns
			);

			const sortedData = this.handler.sortHandler(
				filteredData,
				this.sortBy,
				this.sortDir
			);

			const pagedData = this.handler.paginateHandler(
				sortedData,
				this.perPage,
				this.page
			);

			this.handler.displayHandler(
				pagedData,
				{
					filteredData: filteredData,
					sortedData:   sortedData,
					pagedData:    pagedData,
				},
				this.setRows,
				this.setTotalRowCount
			);
		},
		setRows(rows){
			this.processedRows = rows;
		},
		setTotalRowCount(value){
			this.totalRows = value;
		},
		getRowClasses(row){
			let rowClasses = this.rowClasses;

			if (rowClasses === null){
				rowClasses = this.settings.get('table.row.classes');
			}

			if (typeof rowClasses === 'function'){
				return rowClasses(row);
			}

			return rowClasses;
		},
	},
	handler:  null,
	settings: null,
};
</script>
