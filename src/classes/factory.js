import VueDatatableCell from '../vue-datatable-cell.vue';
import VueDatatableHeader from '../vue-datatable-header.vue';
import VueDatatablePagerButton from '../vue-datatable-pager-button.vue';
import TableType from './table-type.js';
import Settings from './settings.js';

const DEFAULT_DATATABLE = 'datatable';
class DatatableFactory {
    constructor(){
        this.vueConstructor = undefined;
        this.table_types = {};
        this.use_default_type = true;
        this.default_table_settings = new Settings();
    }

    useDefaultType(value){
        this.use_default_type = !!value;

        if(this.vueConstructor){
            if(value){
                this.installTableType(this.table_types[DEFAULT_DATATABLE].getId(), this.table_types[DEFAULT_DATATABLE], Vue);
            } else {
                delete this.vueConstructor.options.components[DEFAULT_DATATABLE];
                delete this.vueConstructor.options.components[DEFAULT_DATATABLE + '-pager'];
            }
            
        }
        return this;
    }

    registerTableType(component_name, callback){
        let table_type = new TableType(component_name);

        this.table_types[component_name] = table_type;

        if(callback && typeof callback === 'function'){
            callback(table_type);
        }

        if(this.vueConstructor){
            this.installTableType(component_name, table_type, this.vueConstructor);
        }

        return this;
    }

    install(Vue){
        Vue.prototype.$datatables = {};

        Vue.component(DEFAULT_DATATABLE + '-cell', VueDatatableCell);
        Vue.component(DEFAULT_DATATABLE + '-header', VueDatatableHeader);
        Vue.component(DEFAULT_DATATABLE + '-button', VueDatatablePagerButton);

        this.registerTableType(DEFAULT_DATATABLE, function(table_type){
            table_type.mergeSettings(this.default_table_settings.properties);
        }.bind(this));
        
        for(var i in this.table_types){
            if(this.use_default_type || i !== DEFAULT_DATATABLE){
                this.installTableType(this.table_types[i].getId(), this.table_types[i], Vue);
            }
        }

        this.vueConstructor = Vue;
    }

    installTableType(id, table_type, Vue){
        Vue.component(id, table_type.getTableDefinition());
        Vue.component(id + '-pager', table_type.getPagerDefinition());
    }
}

export default DatatableFactory;
