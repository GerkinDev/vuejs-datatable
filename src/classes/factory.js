import VueDatatableCell from '../vue-datatable-cell.vue';
import VueDatatableHeader from '../vue-datatable-header.vue';
import VueDatatablePagerButton from '../vue-datatable-pager-button.vue';
import TableType from './table-type.js';
import Settings from './settings.js';

class DatatableFactory {
    constructor(){
        this.table_types = [];
        this.use_default_type = true;
        this.default_table_settings = new Settings();
    }

    useDefaultType(value){
        this.use_default_type = !!value;

        return this;
    }

    registerTableType(component_name, callback){
        let table_type = new TableType(component_name);

        this.table_types.push(table_type);

        if(callback && typeof callback === 'function'){
            callback(table_type);
        }

        return this;
    }

    install(Vue){
        Vue.prototype.$datatables = {};

        Vue.component('datatable-cell', VueDatatableCell);
        Vue.component('datatable-header', VueDatatableHeader);
        Vue.component('datatable-button', VueDatatablePagerButton);

        if(this.use_default_type){
            this.registerTableType('datatable', function(table_type){
                table_type.mergeSettings(this.default_table_settings.properties);
            }.bind(this));
        }

        for(var i in this.table_types){
            this.installTableType(this.table_types[i].getId(), this.table_types[i], Vue);
        }
    }

    installTableType(id, table_type, Vue){
        Vue.component(id, table_type.getTableDefinition());
        Vue.component(id + '-pager', table_type.getPagerDefinition());
    }
}

export default DatatableFactory;
