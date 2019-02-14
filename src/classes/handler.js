/** 
 * This class exposes the main method used to manipulate table data, like filtering, sorting, or paginating. You can override instance's members to customize the behavior of your datatable.
 */
class Handler {
	/**
	 * Comstructs a new handler, defaulting the handlers to the default ones exposed on the class.
	 */
	constructor(){
		/**
		 * @member {Function} - Handler responsible of filtering data rows. Defaults to {@link Handler#handleFilter}.
		 */
		this.filterHandler = this.handleFilter;
		/**
		 * @member {Function} - Handler responsible of sorting data rows. Defaults to {@link Handler#handleSort}.
		 */
		this.sortHandler = this.handleSort;
		/**
		 * @member {Function} - Handler responsible of selecting the correct page in the data rows. Defaults to {@link Handler#handlePaginate}.
		 */
		this.paginateHandler = this.handlePaginate;
		/**
		 * @member {Function} - Handler with unknown usage.... Defaults to {@link Handler#handleDisplay}.
		 */
		this.displayHandler = this.handleDisplay;
	}
	/**
	 * Filter the provided rows, checking if at least a cell contains one of the specified filters.
	 * 
	 * @param {Row[]} data - The data rows to filter
	 * @param {string[]} filter - The strings to search in cells.
	 * @param {Column[]} columns - The columns of the table.
	 * @returns {Row[]} The filtered data rows.
	 */
	handleFilter(data, filter, columns){
		if (!filter){
			return data;
		}

		if (!Array.isArray(filter)) {
			filter = [ filter ];
		}

		return data.filter(row => {
			for (const j in filter) {
				const filterStrings = filter[j].split(/\s/);
				let matched = true;
				for (const i in filterStrings){
					if (!this.rowMatches(row, filterStrings[i], columns)){
						matched = false;
					}
				}
				if (matched) {
					return true;
				}
			}
			return false;
		});
	}
	/**
	 * Check if the provided row contains the filter string in *any* column.
	 * 
	 * @param {Row} row - The data row to search in.
	 * @param {string} filterString - The string to match in a column.
	 * @param {Column[]} columns - The list of columns in the table.
	 * @returns {boolean} `true` if any column contains the searched string.
	 */
	rowMatches(row, filterString, columns){
		for (const i in columns){
			if (columns[i].matches(row, filterString)){
				return true;
			}
		}

		return false;
	}
	/**
	 * Sort the given rows depending on a specific column & sort order.
	 * 
	 * @param {Row[]} filteredData - The rows to sort.
	 * @param {Column} sortColumn - The column used for sorting.
	 * @param {'asc' | 'desc' | null} sortDir - The direction of the sort.
	 * @returns {Row[]} The sorted rows.
	 */
	handleSort(filteredData, sortColumn, sortDir){
		if (!sortColumn || sortDir === null){
			return filteredData;
		}

		return filteredData.sort((a, b) => {
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
	handlePaginate(sortedData, perPage, pageNumber){
		if (!perPage){
			return sortedData;
		}

		if (pageNumber < 1){
			pageNumber = 1;
		}

		const startIndex = (pageNumber - 1) * perPage;
		const endIndex = (pageNumber * perPage);

		return sortedData.slice(startIndex, endIndex);
	}
	/**
	 * Really I don't know...
	 * 
	 * @param {*} processedData -
	 * @param {*} processSteps -
	 * @param {*} setRows -
	 * @param {*} setTotalRowCount -
	 * @returns {void} Nothing.
	 */
	handleDisplay(processedData, processSteps, setRows, setTotalRowCount){
		setRows(processedData);
		setTotalRowCount(processSteps.filteredData.length);
	}
}

export default Handler;
