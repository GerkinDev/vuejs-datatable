import {
	get, set, 
} from 'object-path';

/**
 * @typedef {Object} SettingsProps
 * @description An object representing customizable classes & HTML used for a certain table type.
 * @property {string} table.class              - The classes to apply on the `table` tag itself.
 * @property {string|Function} table.row.class - The classes to apply on each row (`tr` tag).
 * @property {string} table.sorting.sortNone   - The HTML representing the sort icon when the column isn't sorted.
 * @property {string} table.sorting.sortAsc    - The HTML representing the sort icon when sorting the column ascending.
 * @property {string} table.sorting.sortDesc   - The HTML representing the sort icon when sorting the column descending.
 * @property {string} pager.classes.pager      - The class to apply on the pager's `ul` tag.
 * @property {string} pager.classes.li         - The class to apply on the page's `li` tag.
 * @property {string} pager.classes.selected   - The class to apply on the current page's `li` tag.
 * @property {string} pager.classes.disabled   - The class to apply on a disabled page's `li` tag.
 * @property {string} pager.icons.previous     - The HTML representing the *Previous page* icon.
 * @property {string} pager.icons.next         - The HTML representing the *Next page* icon.
 * @tutorial custom-theme
 */

/** 
 * @summary Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * @description Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * Create a new instance of this class & customize it to use different CSS frameworks.
 * The default Settings is for *Bootstrap 3/4* with *glyphicon*.
 * To edit settings contained by an instance of this class, either edit the {@link Settings#properties} object, or use the {@link Settings#merge} method.
 * 
 * @tutorial custom-theme
 */
class Settings {
	/**
	 * Creates a new default instance of settings object.
	 */
	constructor(){
		/**
		 * @member {SettingsProps} - Tree of settings values.
		 */
		this.properties = {
			table: {
				class: 'table table-hover table-striped',
				row:   {
					class: '',
				},
				sorting: {
					sortNone: '↕',
					sortAsc:  '↓',
					sortDesc: '↑',
				},
			},
			pager: {
				classes: {
					pager:    'pagination',
					li:       '',
					selected: 'active',
					disabled: 'disabled',
				},
				icons: {
					previous: '&lt;',
					next:     '&gt;',
				},
			},
		};
	}

	/**
	 * Get a value at a specific path.
	 * 
	 * @param {(string | number | Array.<string | number>)} path - Path to the value to get.
	 * @returns {*} The value at the specified path
	 */
	get(path){
		return get(this.properties, path);
	}

	/**
	 * Defines a value at a specific path
	 * 
	 * @param {(string | number | Array.<string | number>)} path - Path to the value to set.
	 * @param {*} value - New value to set.
	 * @returns {this} For chaining.
	 */
	set(path, value){
		set(this.properties, path, value);

		return this;
	}

	/**
	 * Merges a new settings object within the Settings instance.
	 * 
	 * @param {SettingsProps} settings - New settings object to merge with the current object of the Settings instance.
	 * @returns {this} For chaining.
	 */
	merge(settings){
		this.properties = this._mergeObjects(this.properties, settings);

		return this;
	}

	/**
	 * Merges two objects deeply, and return the 1st parameter once transformed.
	 * 
	 * @private
	 * @param {*} obj1 - The base item to merge, which will be returned.
	 * @param {*} obj2 - The object to inject into `obj1`.
	 * @returns {*} The first object once merged.
	 */
	_mergeObjects(obj1, obj2){
		for (const key in obj2){
			if (typeof obj2[key] === 'object'){
				obj1[key] = this._mergeObjects(obj1[key], obj2[key]);
			} else {
				obj1[key] = obj2[key];
			}
		}

		return obj1;
	}
}

export default Settings;
