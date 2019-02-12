import VueDatatableCell from '../vue-datatable-cell.vue';
import VueDatatableHeader from '../vue-datatable-header.vue';
import VueDatatablePagerButton from '../vue-datatable-pager-button.vue';
import TableType from './table-type.js';
import Settings from './settings.js';

const DEFAULT_DATATABLE = 'datatable';
/**
 * Registers Vuejs-Datatable components globally in VueJS.
 * You should add table types to the {@link table_types} list before using `Vue.use`.
 * 
 * @example import DatatableFactory from 'vuejs-datatable';
	Vue.use(DatatableFactory);
 */
class DatatableFactory {
	/**
	 * Initialize the default factory
	 */
	constructor(){
		/** @member {Vue | undefined} - A reference to the Vue instance the plugin is installed in. */
		this.vueConstructor = undefined;
		/** @member {Dictionary<TableType>} - Registry of declared table types. */
		this.tableTypes = {};
		/** @member {boolean} - Controls whetever the module should register a default table type automatically. */
		this._useDefaultType = true;
		/** @member {Settings} - Base settings instance to merge with custom table type settings. */
		this.defaultTableSettings = new Settings();
	}

	/**
	 * Controls the definition of default table type.
	 * 
	 * @param {boolean} use - `true` to use the default type, false otherwise.
	 * @returns {this} - For chaining.
	 */
	useDefaultType(use){
		this._useDefaultType = !!use;

		if (this.vueConstructor){
			if (use){
				this.installTableType(this.tableTypes[DEFAULT_DATATABLE].getId(), this.tableTypes[DEFAULT_DATATABLE], this.vueConstructor);
			} else {
				delete this.vueConstructor.options.components[DEFAULT_DATATABLE];
				delete this.vueConstructor.options.components[`${ DEFAULT_DATATABLE }-pager`];
			}
			
		}
		return this;
	}

	/**
	 * Creates a new table type with a specified prefix, that you can customize using a callback.
	 * 
	 * @param {string} componentName - The name of the component to register.
	 * @param {function} callback - An optional function to execute, that configures the newly created {@link TableType}. It takes a single parameter: the newly created {@link TableType}
	 * @returns {this} - For chaining.
	 */
	registerTableType(componentName, callback){
		const tableType = new TableType(componentName);

		this.tableTypes[componentName] = tableType;

		if (callback && typeof callback === 'function'){
			callback(tableType);
		}

		if (this.vueConstructor){
			this.installTableType(componentName, tableType, this.vueConstructor);
		}

		return this;
	}

	/**
	 * Declares global components exported by vuejs-datatable, & load configs.
	 * You should add table types to the {@link table_types} list before this function is called.
	 * 
	 * @param {Vue} Vue - The global Vue instance.
	 * @returns {void}
	 */
	install(Vue){
		Vue.prototype.$datatables = {};

		Vue.component(`${ DEFAULT_DATATABLE  }-cell`, VueDatatableCell);
		Vue.component(`${ DEFAULT_DATATABLE  }-header`, VueDatatableHeader);
		Vue.component(`${ DEFAULT_DATATABLE  }-button`, VueDatatablePagerButton);

		if (this.tableTypes.hasOwnProperty(DEFAULT_DATATABLE)){
			this._useDefaultType = true;
		} else {
			this.registerTableType(DEFAULT_DATATABLE, tableType => {
				tableType.mergeSettings(this.defaultTableSettings.properties);
			});
		}
		
		for (const i in this.tableTypes){
			if (this._useDefaultType || i !== DEFAULT_DATATABLE){
				this.installTableType(this.tableTypes[i].getId(), this.tableTypes[i], Vue);
			}
		}
		
		this.vueConstructor = Vue;
	}

	/**
	 * Declares a pair of components (a Datatable & a Datatable-Pager) sharing a config.
	 * 
	 * @param {string} id - The base name of the datatable type.
	 * @param {TableType} tableType - The configuration object that describes both datatable & the related pager.
	 * @param {Vue} Vue - The global Vue instance.
	 * @returns {void}
	 */
	installTableType(id, tableType, Vue){
		Vue.component(id, tableType.getTableDefinition());
		Vue.component(`${ id }-pager`, tableType.getPagerDefinition());
	}
}

export default DatatableFactory;
