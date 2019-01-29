import VueDatatableCell from '../vue-datatable-cell.vue';
import VueDatatableHeader from '../vue-datatable-header.vue';
import VueDatatablePagerButton from '../vue-datatable-pager-button.vue';
import TableType from './table-type.js';
import Settings from './settings.js';

const DEFAULT_DATATABLE = 'datatable';
export default class DatatableFactory {
	constructor(){
		this.vueConstructor = undefined;
		this.tableTypes = {};
		this._useDefaultType = true;
		this.defaultTableSettings = new Settings();
	}

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

	installTableType(id, tableType, Vue){
		Vue.component(id, tableType.getTableDefinition());
		Vue.component(`${ id }-pager`, tableType.getPagerDefinition());
	}
}
