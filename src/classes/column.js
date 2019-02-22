import { get } from 'object-path';

/**
 * A class responsible for handling a full column with its header.
 */
class Column {
	/**
	 * Defines a new column.
	 * 
	 * @param {object} props - A configuration object for the column.
	 * @param {string} [props.align = ''] - The alignment direction of the cells in this column.
	 * @param {string} [props.label = ''] - The label displayed in the header.
	 * @param {string} [props.field = ''] - The name of the field in the row object.
	 * @param {function} [props.representedAs] - A transformation function that returns the string to display
	 * @param {*} [props.component] - .... Yeah I don't know what it is.
	 * @param {boolean} [props.interpolate = false] - Set to true to convert the return value of `props.representedAs` to HTML.
	 * @param {VueDatatableHeader} [props.headerComponent] - The header cell component of the column.
	 * @param {boolean} [props.sortable = true] - Controls whetever this column can be sorted.
	 * @param {boolean} [props.filterable = true] - Controls whetever this column can be filtered.
	 * @param {string} [props.headerClass = ''] - The base CSS class to apply to the header component.
	 */
	constructor(props){
		/** @member {string} - The alignment direction of the cells in this column. */
		this.setAlignment(props.align);
		/** @member {string} - The label displayed in the header. */
		this.label = props.label || '';
		/** @member {string} - The name of the field in the row object. */
		this.field = props.field || null;
		/** @member {function | null} - A transformation function that returns the string to display */
		this.representedAs = props.representedAs || null;
		/** @member {* | null} - .... Yeah I don't know what it is. */
		this.component = props.component || null;
		/** @member {boolean} - Set to true to convert the return value of `props.representedAs` to HTML. */
		this.interpolate = props.interpolate || false;
		/** @member {VueDatatableHeader | null} - The header cell component of the column. */
		this.headerComponent = props.headerComponent || null;
		/** @member {boolean} - Controls whetever this column can be sorted. */
		this.sortable = Column.isSortable(props);
		/** @member {boolean} - Controls whetever this column can be filtered. */
		this.filterable = Column.isFilterable(props);
		/** @member {string} - The base CSS class to apply to the header component. */
		this.headerClass = props.headerClass || '';
	}

	/**
	 * Set the display alignment of cells of this column. If the provided parameter is not recognized, it will default to `left`.
	 * 
	 * @param {string} value - The alignment of the column. Must be one of `left`, `center` or `right`.
	 * @returns {this} - For chaining.
	 */
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

	/**
	 * Check if the column use plain text value (eg `representedAs` or `field`, but not `component`)
	 * If multiple representation props are provided, it is considered as plain text if there are alternatives to `component`
	 * 
	 * @param {object} props - The column definition object
	 * @returns {boolean} - `true` if the column can be represented by plain text, `false` otherwise
	 */
	static isPlainTextField(props){
		if (!props.field && !props.representedAs){
			return false;
		}

		if (props.component && !(props.representedAs || props.field)){
			return false;
		}

		return true;
	}

	/**
	 * Check if the column can be filtered.
	 * 
	 * @param {object} props - The column definition object
	 * @returns {boolean} - `true` if the column can be filtered, `false` otherwise
	 */
	static isFilterable(props){
		// If the option is explicitly disabled, use it
		if (props.filterable === false){
			return false;
		}

		return this.isPlainTextField(props);
	}

	/**
	 * Check if the column can be sorted.
	 * 
	 * @param {object} props - The column definition object
	 * @returns {boolean} - `true` if the column can be sorted, `false` otherwise
	 */
	static isSortable(props){
		// If the option is explicitly disabled, use it
		if (props.sortable === false){
			return false;
		}

		return this.isPlainTextField(props);
	}

	/**
	 * Converts a row to its string representation for the current column.
	 * 
	 * @param {object} row - The row to convert
	 * @returns {string} - The string representation of this row in the current column.
	 */
	getRepresentation(row) {
		if (this.representedAs && typeof this.representedAs === 'function'){
			return this.representedAs(row);
		}

		return get(row, this.field);
	}

	/**
	 * Alias for {@link getRepresentation}.
	 * 
	 * @deprecated It will be removed in v2.0.0. Please use `getRepresentation` instead.
	 * @param {object} row - The row to convert
	 * @returns {string} - The string representation of this row in the current column.
	 */
	getValue(row){
		return this.getRepresentation(row);
	}

	/**
	 * Check if the provided row's representation matches a certain filter string.
	 * 
	 * @param {object} row - The row to check.
	 * @param {string} filterString - The filter string to test.
	 * @returns {boolean} - `true` if the row matches the filter, `false` otherwise.
	 */
	matches(row, filterString) {
		const colRepresentation = (`${  this.getRepresentation(row)  }`).toLowerCase();

		return colRepresentation.indexOf(filterString.toLowerCase()) !== -1;
	}
}

export default Column;
