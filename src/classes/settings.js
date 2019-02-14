import {
	get, set, 
} from 'object-path';
/** 
 * @summary Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * @description Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * Create a new instance of this class & customize it to use different CSS frameworks.
 * The default Settings is for *Bootstrap 3/4* with *glyphicon*.
 * To edit settings contained by an instance of this class, either edit the {@link Settings#properties} object, or use the {@link Settings#merge} method.
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
					classes: [ '' ],
				},
				sorting: {
					classes: {
						canSort:  [ 'sort' ],
						sortNone: [ 'glyphicon', 'glyphicon-sort' ],
						sortAsc:  [ 'glyphicon', 'glyphicon-sort-by-alphabet' ],
						sortDesc: [ 'glyphicon', 'glyphicon-sort-by-alphabet-alt' ],
					},
				},
			},
			pager: {
				classes: {
					pager:    'pagination',
					li:       '',
					a:        '',
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

	_mergeObjects(obj1, obj2){
		for (const key in obj2){

			if (obj2[key] === null){
				obj1[key] = obj2[key];

				continue;
			} else if (typeof obj2[key] === 'object'){
				obj1[key] = this._mergeObjects(obj1[key], obj2[key]);

				continue;
			}

			obj1[key] = obj2[key];
		}

		return obj1;
	}
}

export default Settings;
