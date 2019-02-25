import VueDatatableCell from '../vue-datatable-cell.vue';
import VueDatatableHeader from '../vue-datatable-header.vue';
import VueDatatablePagerButton from '../vue-datatable-pager-button.vue';
import TableType from './table-type.js';

/**
 * @member {'datatable'} DEFAULT_DATATABLE - The default table type name
 * @memberof DatatableFactory
 * @public
 * @readonly
 */
const DEFAULT_DATATABLE = 'datatable';

/**
 * Registers Vuejs-Datatable components globally in VueJS.
 * 
 * @example import DatatableFactory from 'vuejs-datatable';
	Vue.use(DatatableFactory);
 */
class DatatableFactory {
	/**
	 * Initialize the default factory
	 */
	constructor(){
		/**
		 * @private
		 * @member {VueConstructor | undefined} - A reference to the Vue instance the plugin is installed in. It may be used to check if the factory was already installed
		 */
		this.vueInstance = undefined;
		/**
		 * @private
		 * @member {Dictionary<TableType>} - Registry of declared table types.
		 */
		this.tableTypes = {};
		/**
		 * @private
		 * @member {TableType} - The default table type to use if no other configuration was provided.
		 */
		this.defaultTableType = new TableType(DEFAULT_DATATABLE);
		
		this.useDefaultType(true);
	}

	/**
	 * Get a table type by its identifier.
	 * 
	 * @param {string} [id = DEFAULT_DATATABLE] - The identifier of the table type. If not provided, it will default to the default table type.
	 * @returns {TableType | undefined} The table type registered with that identifier.
	 */
	getTableType(id = DEFAULT_DATATABLE){
		return this.tableTypes[id];
	}

	/**
	 * Controls the definition of default table type.
	 * 
	 * @param {boolean} [use] - `true` to use the default type, `false` otherwise. If not provided, this method returns a boolean indicating if the default table type is / will be used.
	 * @returns {this | boolean} - `this` for chaining, or the value if `use` is undefined
	 */
	useDefaultType(use){
		if (typeof use !== 'boolean' && !use){
			return this.tableTypes[DEFAULT_DATATABLE] === this.defaultTableType;
		}
		if (use){
			this.registerTableType(this.defaultTableType);
		} else {
			this.deregisterTableType(this.defaultTableType);
		}
		
		return this;
	}

	/**
	 * Creates a new table type with a specified prefix, that you can customize using a callback.
	 * 
	 * @param {string | TableType} nameOrTableType - The name of the component to register, or a {@link TableType} object.
	 * @param {function} [callback] - An optional function to execute, that configures the newly created {@link TableType}. It takes a single parameter: the newly created {@link TableType}, and should return the transformed table type.
	 * @returns {this} - For chaining.
	 */
	registerTableType(nameOrTableType, callback){
		const tableType = nameOrTableType instanceof TableType ? nameOrTableType : new TableType(nameOrTableType);
		const transformedTableType = (callback && typeof callback === 'function') ? callback(tableType) || tableType : tableType;

		const name = transformedTableType.id;
		this.tableTypes[name] = transformedTableType;
		if (this.vueInstance){
			this.installTableType(name);
		}

		return this;
	}

	/**
	 * Creates a new table type with a specified prefix, that you can customize using a callback.
	 * 
	 * @param {string | TableType} nameOrTableType - The name of the component to register, or a {@link TableType} object.
	 * @returns {this} - For chaining.
	 */
	deregisterTableType(nameOrTableType){
		const name = nameOrTableType instanceof TableType ? nameOrTableType.id : nameOrTableType;

		if (this.vueInstance){
			this.uninstallTableType(name);
		}
		delete this.tableTypes[name];
		
		return this;
	}

	/**
	 * Declares global components exported by vuejs-datatable, & load configs.
	 * 
	 * @param {VueConstructor} Vue - The Vue instance to configure.
	 * @returns {void}
	 */
	install(Vue){
		this.vueInstance = Vue;
		Vue.prototype.$datatables = {};

		Vue.component(`${ DEFAULT_DATATABLE }-cell`, VueDatatableCell);
		Vue.component(`${ DEFAULT_DATATABLE }-header`, VueDatatableHeader);
		Vue.component(`${ DEFAULT_DATATABLE }-button`, VueDatatablePagerButton);
		
		for (const type of Object.values(this.tableTypes)){
			this.installTableType(type.id);
		}
	}

	/**
	 * Declares a pair of components (a Datatable & a Datatable-Pager) sharing a config.
	 * 
	 * @private
	 * @param {string} id - The base name of the datatable type.
	 * @param {TableType} tableType - The configuration object that describes both datatable & the related pager.
	 * @returns {this} - For chaining.
	 */
	installTableType(id){
		const tableType = this.tableTypes[id];
		const tableDef = tableType.getTableDefinition();
		this.vueInstance.component(tableDef.name, tableDef);
		const pagerDef = tableType.getPagerDefinition();
		this.vueInstance.component(pagerDef.name, pagerDef);
		return this;
	}

	/**
	 * Remove a table type definition from vue (the datatable & its associated pager).
	 * This should be used carefully, because Vue won't be able to instanciate new instances of this table type.
	 * 
	 * @private
	 * @param {string} id - The base name of the datatable type to forget.
	 * @returns {this} - For chaining.
	 */
	uninstallTableType(id){
		const tableType = this.tableTypes[id];
		const tableDef = tableType.getTableDefinition();
		delete this.vueInstance.options.components[tableDef.name];
		const pagerDef = tableType.getPagerDefinition();
		delete this.vueInstance.options.components[pagerDef.name];
		
		return this;
	}
}

export default DatatableFactory;
