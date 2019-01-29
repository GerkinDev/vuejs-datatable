export default class Handler {
	constructor(){
		this.filterHandler = this.handleFilter;
		this.sortHandler = this.handleSort;
		this.paginateHandler = this.handlePaginate;
		this.displayHandler = this.handleDisplay;
	}
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
	rowMatches(row, filterString, columns){
		for (const i in columns){
			if (columns[i].matches(row, filterString)){
				return true;
			}
		}

		return false;
	}
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
	handlePaginate(sortedData, pageCount, pageNumber){
		if (!pageCount){
			return sortedData;
		}

		if (pageNumber < 1){
			pageNumber = 1;
		}

		const startIndex = (pageNumber - 1) * pageCount;
		const endIndex = (pageNumber * pageCount);

		return sortedData.slice(startIndex, endIndex);
	}
	handleDisplay(processedData, processSteps, setRows, setTotalRowCount){
		setRows(processedData);
		setTotalRowCount(processSteps.filteredData.length);
	}
}
