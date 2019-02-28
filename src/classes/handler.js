// From https://stackoverflow.com/a/48660568/4839162
const stableSort = (arr, compare) => arr
	.map((item, index) => ({
		item,
		index,
	}))
	.sort((a, b) => compare(a.item, b.item) || a.index - b.index)
	.map(({item}) => item);

/** 
 * This class exposes the main method used to manipulate table data, like filtering, sorting, or paginating. You can override instance's members to customize the behavior of your datatable.
 */
class Handler {
	/**
	 * Comstructs a new handler, defaulting the handlers to the default ones exposed on the class.
	 */
	constructor(){
		/**
		 * @member {Function} - Handler responsible of filtering data rows. Defaults to {@link Handler#defaultFilterHandler}.
		 */
		this.filterHandler = this.defaultFilterHandler;
		/**
		 * @member {Function} - Handler responsible of sorting data rows. Defaults to {@link Handler#defaultSortHandler}.
		 */
		this.sortHandler = this.defaultSortHandler;
		/**
		 * @member {Function} - Handler responsible of selecting the correct page in the data rows. Defaults to {@link Handler#defaultPaginateHandler}.
		 */
		this.paginateHandler = this.defaultPaginateHandler;
		/**
		 * Handler to post-process the paginated data, and determine which data to actually display. It supports promises. Defaults to {@link Handler#defaultDisplayHandler}.
		 * 
		 * @method displayHandler
		 * @memberof Handler
		 * @instance
		 * @readonly
		 * @see TableType#setDisplayHandler
		 * @tutorial ajax-handler
		 * @param {object} processSteps            - The result of each processing steps, stored in an object. Each step is the result of one of the processing function
		 * ({@link Handler#filterHandler}, {@link Handler#sortHandler}, {@link Handler#paginateHandler}), applied on the previous step.
		 * @param {TRow[]|*} processSteps.source   - The original {@link Datatable#data} property of the datatable.
		 * @param {TRow[]|*} processSteps.filtered - The return value of {@link Handler#filterHandler}.
		 * @param {TRow[]|*} processSteps.sorted   - The return value of {@link Handler#sortHandler}.
		 * @param {TRow[]|*} processSteps.paged    - The return value of {@link Handler#paginateHandler}.
		 * @returns {Promise<DisplayHandlerResult>} Processed values to set on the datatable.
		 */
		this.displayHandler = this.defaultDisplayHandler;
	}
	/**
	 * Filter the provided rows, checking if at least a cell contains one of the specified filters.
	 * 
	 * @param {Row[]} data - The data rows to filter
	 * @param {string[] | string | undefined} filters - The strings to search in cells.
	 * @param {Column[]} columns - The columns of the table.
	 * @returns {Row[]} The filtered data rows.
	 */
	defaultFilterHandler(data, filters, columns){
		if (!Array.isArray(filters)) {
			filters = (filters || '').split(/\s/).filter(v => !!v);
		}
		
		if (filters.length === 0){
			return data;
		}

		return data.filter(row => filters.some(filter => this.rowMatches(row, filter, columns)));
	}
	/**
	 * Sort the given rows depending on a specific column & sort order.
	 * 
	 * @param {Row[]} filteredData - The rows to sort.
	 * @param {Column} sortColumn - The column used for sorting.
	 * @param {'asc' | 'desc' | null} sortDir - The direction of the sort.
	 * @returns {Row[]} The sorted rows.
	 */
	defaultSortHandler(filteredData, sortColumn, sortDir){
		if (!sortColumn || sortDir === null){
			return filteredData;
		}

		return stableSort(filteredData, (a, b) => {
			const valA = sortColumn.getRepresentation(a);
			const valB = sortColumn.getRepresentation(b);

			if (valA === valB){
				return 0;
			}

			let sortVal = valA > valB ? 1 : -1;

			if (sortDir === 'desc'){
				sortVal *= -1;
			}

			return sortVal;
		});
	}
	/**
	 * Split the rows list to display the requested page index.
	 * 
	 * @param {Row[]} sortedData - All data rows.
	 * @param {number} perPage - The total number of items per page.
	 * @param {number} pageNumber - The index of the page to display.
	 * @returns {Row[]} The requested page's rows.
	 */
	defaultPaginateHandler(sortedData, perPage, pageNumber){
		if (perPage < 1){
			throw new RangeError(`Pagination requires at least 1 item per page, have ${ perPage }`);
		}

		if (pageNumber < 1){
			throw new RangeError(`Pagination requires being applied to page 1 or more, have ${ pageNumber }`);
		}

		const startIndex = (pageNumber - 1) * perPage;
		const endIndex = (pageNumber * perPage);

		return sortedData.slice(startIndex, endIndex);
	}
	/**
	 * Handler to post-process the paginated data, and determine which data to actually display.
	 * 
	 * @param {object} processSteps            - The result of each processing steps, stored in an object. Each step is the result of one of the processing function
	 * ({@link Handler#filterHandler}, {@link Handler#sortHandler}, {@link Handler#paginateHandler}), applied on the previous step.
	 * @param {TRow[]|*} processSteps.source   - The original {@link Datatable#data} property of the datatable.
	 * @param {TRow[]|*} processSteps.filtered - The return value of {@link Handler#filterHandler}.
	 * @param {TRow[]|*} processSteps.sorted   - The return value of {@link Handler#sortHandler}.
	 * @param {TRow[]|*} processSteps.paged    - The return value of {@link Handler#paginateHandler}.
	 * @returns {Promise<DisplayHandlerResult>} Processed values to set on the datatable.
	 */
	defaultDisplayHandler({
		filtered, paged, 
	}){
		return {
			rows:          paged,
			totalRowCount: filtered.length,
		};
	}
	/**
	 * Check if the provided row contains the filter string in *any* column.
	 * 
	 * @param {TRow} row - The data row to search in.
	 * @param {string} filterString - The string to match in a column.
	 * @param {Column[]} columns - The list of columns in the table.
	 * @returns {boolean} `true` if any column contains the searched string.
	 */
	rowMatches(row, filterString, columns){
		return columns.some(column => column.matches(row, filterString));
	}
}

export default Handler;
