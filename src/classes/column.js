import { get } from 'object-path';

export default class Column {
	constructor(props){
		this.setAlignment(props.align);
		this.label = props.label || '';
		this.field = props.field || null;
		this.representedAs = props.representedAs || null;
		this.component = props.component || null;
		this.interpolate = props.interpolate || false;
		this.headerComponent = props.headerComponent || null;
		this.sortable = this.isSortable(props);
		this.filterable = this.isFilterable(props);
		this.headerClass = props.headerClass || '';
	}

	setAlignment(value){
		if (!value || typeof value !== 'string'){
			this.align = 'left';

			return this;
		}

		if (value.toLowerCase() === 'center'){
			this.align = 'center';

			return this;
		}

		if (value.toLowerCase() === 'right'){
			this.align = 'right';

			return this;
		}

		this.align = 'left';

		return this;
	}

	isFilterable(props){
		if (props.filterable === false){
			return false;
		}

		if (!props.field && !props.representedAs){
			return false;
		}

		if (this.component && !(this.representedAs || this.field)){
			return false;
		}

		return true;
	}

	isSortable(props){
		if (props.sortable === false){
			return false;
		}

		if (!props.field && !props.representedAs){
			return false;
		}

		if (this.component && !(this.representedAs || this.field)){
			return false;
		}

		return true;
	}

	getRepresentation(row) {
		if (this.representedAs && typeof this.representedAs === 'function'){
			return this.representedAs(row);
		}

		return get(row, this.field);
	}

	getValue(row){
		return this.getRepresentation(row);
	}

	matches(row, filterString) {
		const colRepresentation = (`${  this.getRepresentation(row)  }`).toLowerCase();

		return colRepresentation.indexOf(filterString.toLowerCase()) !== -1;
	}
}
