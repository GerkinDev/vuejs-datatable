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

/**
 * The main component of the module, used to display a datatable.
 * 
 * @module datatable
 * 
 * @vue-prop {string} [name] - The name of the datatable. It should be unique per page.
 * @vue-prop {ColumnDef[]} columns - List of columns definitions displayed by this datatable.
 * @vue-prop {Array.<*>|Function} data - The list of items to display, or a getter function.
 * @vue-prop {string} [filterBy] - Value to match in rows for display filtering.
 * @vue-prop {(string | Array.<string> | Function)} [rowClasses] - Class(es) or getter function to get row classes.
 *
 * @vue-data {Column | null} sortBy - Column used for data sorting.
 * @vue-data {'asc' | 'desc' | null} sortDir - Direction of the sort. A null value is equivalent to 'asc'.
 * @vue-data {number} totalRows - Total number of rows contained by this data table.
 * @vue-data {number} page - Current page index.
 * @vue-data {number | null} perPage - Maximum number of rows displayed per page.
 * @vue-data {Row[]} processedRows - Array of rows displayed by the table.
 * 
 * @vue-computed {Array.<*>} rows - Array of rows currently managed by the datatable.
 * @vue-computed {Settings} settings - Reference to the {@link Settings} object linked to this datatable instance.
 * @vue-computed {Handler} handler - Reference to the {@link Handler} object linked to this datatable instance.
 * @vue-computed {Column[]} normalizedColumns - Array of columns definitions casted as {@link Column} objects.
 * @vue-computed {string} tableClass - Base CSS class to apply to the `&lt;table&gt;` element.
 */
export default {
	props: {
		name: {
			type:    String,
			default: 'default',
		},
		columns: {
			type:     Array,
			required: true,
		},
		data: {
			type:     [ Array, Function ],
			required: true,
		},
		filterBy: {
			type:    String,
			default: null,
		},
		rowClasses: {
			type:    [ String, Array, Function ],
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
		/**
		 * Get the sort direction for a specific column.
		 * 
		 * @param {Column} columnDefinition - The column to check sorting direction for.
		 * @returns {'asc' | 'desc' | null} The sort direction for the specified column.
		 */
		getSortDirectionForColumn(columnDefinition){
			if (this.sortBy !== columnDefinition){
				return null;
			}

			return this.sortDir;
		},
		/**
		 * Defines the sort direction for a specific column.
		 * 
		 * @param {'asc' | 'desc' | null} direction - The direction of the sort.
		 * @param {Column} column - The column to check sorting direction for.
		 * @returns {void} Nothing.
		 */
		setSortDirectionForColumn(direction, column){
			this.sortBy = column;
			this.sortDir = direction;
		},
		/**
		 * Using data (or its return value if it is a function), filter, sort, paginate & display rows in the table.
		 * 
		 * @returns {void} Nothing.
		 */
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
		/**
		 * Set the displayed rows.
		 * 
		 * @param {Row[]} rows - The rows to display.
		 * @returns {void} Nothing.
		 */
		setRows(rows){
			this.processedRows = rows;
		},
		/**
		 * Set the displayed rows count.
		 * 
		 * @param {number} value - The number of displayed rows.
		 * @returns {void} Nothing.
		 */
		setTotalRowCount(value){
			this.totalRows = value;
		},
		/**
		 * Get the classes to add on the row
		 * 
		 * @param {Row} row - The row to get classes for.
		 * @returns {string} The classes string to set on the row.
		 */
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
