class Handler {
    constructor(){
        this.filterHandler = this.handleFilter;
        this.sortHandler = this.handleSort;
        this.paginateHandler = this.handlePaginate;
        this.displayHandler = this.handleDisplay;
    }
    handleFilter(data, filter, columns){
        if(!filter){
            return data;
        }

        if(!Array.isArray(filter)) {
            filter = [filter];
        }

        return data.filter(function(row){
            for(var j in filter) {
                let filter_strings = filter[j].split(/\s/);
                let matched = true;
                for(var i in filter_strings){
                    if(!this.rowMatches(row, filter_strings[i], columns)){
                        matched = false;
                    }
                }
                if(matched) {
                    return true;
                }
            }
            return false;
        }.bind(this));
    }
    rowMatches(row, filter_string, columns){
        for(var i in columns){
            if(columns[i].matches(row, filter_string)){
                return true;
            }
        }

        return false;
    }
    handleSort(filtered_data, sort_column, sort_dir){
		if(!sort_column || sort_dir === null){
			return filtered_data;
		}

		return filtered_data.sort(function(a, b){
			var value_a = sort_column.getRepresentation(a);
			var value_b = sort_column.getRepresentation(b);

			if(value_a == value_b){
				return 0;
			}

			var sort_val = value_a > value_b ? 1 : -1;

			if(sort_dir === 'desc'){
				sort_val *= -1;
			}

			return sort_val;
		});
    }
    handlePaginate(sorted_data, page_count, page_number){
		if(!page_count){
			return sorted_data;
		}

		if(page_number < 1){
			page_number = 1;
		}

        let start_index = (page_number - 1) * page_count;
        let end_index = (page_number * page_count);

        return sorted_data.slice(start_index, end_index);
    }
    handleDisplay(processed_data, process_steps, setRows, setTotalRowCount){
        setRows(processed_data);
        setTotalRowCount(process_steps.filtered_data.length);
    }
}

export default Handler;
