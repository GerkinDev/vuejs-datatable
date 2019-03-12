// From https://stackoverflow.com/a/48660568/4839162
const stableSort = ( arr, compare ) => arr
	.map( ( item, index ) => ( {
		item,
		index,
	} ) )
	.sort( ( a, b ) => compare( a.item, b.item ) || a.index - b.index )
	.map( ( {item} ) => item );

/**
 * @typedef {Object} DisplayHandlerResult
 * @property {TRow[]} rows          - The actual rows to display
 * @property {number} totalRowCount - The total number of rows in the table. It counts also items on other pages.
 * The pages in the pagination component are calculated using this value.
 */

/** 
 * This class exposes the main method used to manipulate table data, like filtering, sorting, or paginating. You can override instance's members to customize the behavior of your datatable.
 * Handlers are called in this order: filter, sort, paginate, display.
 * 
 * In case you are overriding *one* of those handlers, make sure that its return value is compatible with subsequent handlers. Otherwise, you'll require to override all of them.
 * 
 * @tutorial ajax-handler
 */
class Handler {
	/**
	 * Comstructs a new handler, defaulting the handlers to the default ones exposed on the class.
	 */
	constructor(){
		/**
		 * Filter the provided rows, checking if at least a cell contains one of the specified filters. It supports promises. Defaults to {@link Handler#defaultFilterHandler}.
		 * 
		 * @method filterHandler
		 * @memberof Handler
		 * @instance
		 * @readonly
		 * @see TableType#setFilterHandler
		 * @tutorial ajax-handler
		 * @param {TRow[]|*} data                         - The data to apply filter on. It is usually an array of rows, but it can be whatever you set in the {@link Datatable#data} property.
		 * @param {string[] | string | undefined} filters - The strings to search in cells.
		 * @param {Column[]} columns                      - The columns of the table.
		 * @returns {Promise<TRow[]|*>} The filtered data. It is usually an array of rows, but it can be whatever you like.
		 */
		this.filterHandler = this.defaultFilterHandler;
		/**
		 * Sort the given rows depending on a specific column & sort order. It suports promises. Defaults to {@link Handler#defaultSortHandler}.
		 * 
		 * @method sortHandler
		 * @memberof Handler
		 * @instance
		 * @readonly
		 * @see TableType#setSortHandler
		 * @tutorial ajax-handler
		 * @param {TRow[]|*} filteredData         - Data outputed from {@link Handler#filterHandler}. It is usually an array of rows, but it can be whatever you like.
		 * @param {Column} sortColumn             - The column used for sorting.
		 * @param {'asc' | 'desc' | null} sortDir - The direction of the sort.
		 * @returns {Promise<TRow[]|*>} The sorted rows. It is usually an array of rows, but it can be whatever you like.
		 */
		this.sortHandler = this.defaultSortHandler;
		/**
		 * Split the rows list to display the requested page index. It supports promises. Defaults to {@link Handler#defaultPaginateHandler}.
		 * 
		 * @method paginateHandler
		 * @memberof Handler
		 * @instance
		 * @readonly
		 * @see TableType#setPaginateHandler
		 * @tutorial ajax-handler
		 * @param {TRow[]|*} sortedData - Data outputed from {@link Handler#sortHandler}. It is usually an array of rows, but it can be whatever you like.
		 * @param {number} perPage      - The total number of items per page.
		 * @param {number} pageNumber   - The index of the page to display.
		 * @returns {Promise<TRow[]|*>} The requested page's rows. It is usually an array of rows, but it can be whatever you like.
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
	 * @param {TRow[]} data                           - The data to apply filter on.
	 * @param {string[] | string | undefined} filters - The strings to search in cells.
	 * @param {Column[]} columns                      - The columns of the table.
	 * @returns {Promise<TRow[]>} The filtered data rows.
	 */
	defaultFilterHandler( data, filters, columns ){
		if ( !Array.isArray( filters ) ) {
			filters = ( filters || '' ).split( /\s/ ).filter( v => !!v );
		}
		
		if ( filters.length === 0 ){
			return data;
		}

		return data.filter( row => filters.some( filter => this.rowMatches( row, filter, columns ) ) );
	}
	/**
	 * Sort the given rows depending on a specific column & sort order.
	 * 
	 * @param {TRow[]} filteredData           - Data outputed from {@link Handler#filterHandler}.
	 * @param {Column} sortColumn             - The column used for sorting.
	 * @param {'asc' | 'desc' | null} sortDir - The direction of the sort.
	 * @returns {Promise<TRow[]>} The sorted rows.
	 */
	defaultSortHandler( filteredData, sortColumn, sortDir ){
		if ( !sortColumn || sortDir === null ){
			return filteredData;
		}

		return stableSort( filteredData, ( a, b ) => {
			const valA = sortColumn.getRepresentation( a );
			const valB = sortColumn.getRepresentation( b );

			if ( valA === valB ){
				return 0;
			}

			let sortVal = valA > valB ? 1 : -1;

			if ( sortDir === 'desc' ){
				sortVal *= -1;
			}

			return sortVal;
		} );
	}
	/**
	 * Split the rows list to display the requested page index.
	 * 
	 * @param {TRow[]} sortedData - Data outputed from {@link Handler#sortHandler}.
	 * @param {number} perPage    - The total number of items per page.
	 * @param {number} pageNumber - The index of the page to display.
	 * @returns {Promise<TRow[]>} The requested page's rows.
	 */
	defaultPaginateHandler( sortedData, perPage, pageNumber ){
		if ( perPage < 1 || pageNumber < 1 ){
			return sortedData;
		}

		const startIndex = ( pageNumber - 1 ) * perPage;
		const endIndex = ( pageNumber * perPage );

		return sortedData.slice( startIndex, endIndex );
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
	defaultDisplayHandler( {
		filtered, paged, 
	} ){
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
	rowMatches( row, filterString, columns ){
		return columns.some( column => column.matches( row, filterString ) );
	}
}

export default Handler;
