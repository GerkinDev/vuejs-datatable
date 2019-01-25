import VueDatatable from '../vue-datatable.vue';
import VueDatatablePager from '../vue-datatable-pager.vue';
import Handler from './handler.js';
import Settings from './settings.js';

/**
 * Defines a type of Datatable, with its {@link Settings} object.
 */
class TableType {
	/**
	 * Creates a new datatable type, instanciating a new {@link Settings} object.
	 * 
	 * @param {string} id - The identifier of this datatable type
	 */
	constructor(id){
		/**
		 * @member {string} - Identifier of the table type
		 */
		this.id = id;

		/**
		 * @member {Handler} - Handler associated with the table type
		 */
		this.handler = new Handler();
		/**
		 * @member {Settings} - Settings object used to get various values for the datatable & other components
		 */
		this.settings = new Settings();
	}

	/**
	 * Retrieves the Id of the table type
	 * 
	 * @returns {string} The ID if the table type
	 */
	getId(){
		return this.id;
	}

	/**
	 * Defines the function used to filter data
	 * 
	 * @see Handler.handleFilter
	 * @param {Function} closure - The function to use for sorting.
	 * @returns {this} For chaining.
	 */
	setFilterHandler(closure){
		this.handler.filterHandler = closure;

		return this;
	}

	/**
	 * Defines the function used to sort data
	 * 
	 * @see Handler.handleSort
	 * @param {Function} closure - The function to use for sorting.
	 * @returns {this} For chaining.
	 */
	setSortHandler(closure){
		this.handler.sortHandler = closure;

		return this;
	}

	/**
	 * Defines the function used to paginate data
	 * 
	 * @see Handler.handlePaginate
	 * @param {Function} closure - The function to use for pagination.
	 * @returns {this} For chaining.
	 */
	setPaginateHandler(closure){
		this.handler.paginateHandler = closure;

		return this;
	}

	/**
	 * Defines the function used to display data
	 * 
	 * @see Handler.handleDisplay
	 * @param {Function} closure - The function to use for display.
	 * @returns {this} For chaining.
	 */
	setDisplayHandler(closure){
		this.handler.displayHandler = closure;

		return this;
	}

	/**
	 * Get or set a {@link Settings} value at a specific path
	 * 
	 * @param {(string | number | Array.<string | number>)} path - Path to the setting value to get/set
	 * @param {*} [value] - If omitted, this method will *get* the value at the specified `path`. Otherwise, it will *set* the value.
	 * @returns {this | *} In *get* mode, the value. In *set* mode, `this`, for chaining.
	 */
	setting(path, value){
		if (value === undefined){
			return this.settings.get(path);
		}

		this.settings.set(path, value);

		return this;
	}

	/**
	 * Merge a settings object with the {@link TableType#settings} object of the instance.
	 * 
	 * @param {SettingsProps} settings - Values to merge
	 * @returns {this} For chaining.
	 */
	mergeSettings(settings){
		this.settings.merge(settings);

		return this;
	}

	/**
	 * Factory function that copy the {@link VueDatatable} prototype, and configure as this type.
	 * 
	 * @returns {VueDatatable} A new factored {@link VueDatatable} constructor.
	 */
	getTableDefinition(){
		const definition = this.clone(VueDatatable);
		definition.handler = this.handler;
		definition.settings = this.settings;
		definition.name = this.id;

		return definition;
	}

	/**
	 * Factory function that copy the {@link VueDatatablePager} prototype, and configure as this type.
	 * 
	 * @returns {VueDatatablePager} A new factored {@link VueDatatablePager} constructor.
	 */
	getPagerDefinition(){
		const definition = this.clone(VueDatatablePager);
		definition.settings = this.settings;
        definition.name = this.id + '-pager';

		return definition;
	}

	/**
	 * Deep clone a value
	 * 
	 * @param {*} obj - The value to clone
	 * @returns {*} The clone of the original parameter.
	 */
	clone(obj) {
		let copy;

		if (obj === null || typeof obj !== 'object') {
			return obj;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];

			for (let i = 0; i < obj.length; i++) {
				copy[i] = this.clone(obj[i]);
			}

			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};

			for (const attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = this.clone(obj[attr]);
				}
			}

			return copy;
		}

		throw new Error('Unable to copy obj! Its type isn\'t supported.');
	}
}

export default TableType;
