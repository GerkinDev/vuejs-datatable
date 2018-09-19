import { get, set } from 'object-path';

class Settings {
    constructor(){
        this.properties = {
            table: {
                class: 'table table-hover table-striped',
                row: {
                    classes: ['']
                },
                sorting: {
                    classes: {
                        canSort: ['sort'],
                        sortNone: ['glyphicon', 'glyphicon-sort'],
                        sortAsc: ['glyphicon', 'glyphicon-sort-by-alphabet'],
                        sortDesc: ['glyphicon', 'glyphicon-sort-by-alphabet-alt'],
                    }
                }
            },
            pager: {
                classes: {
                    pager: 'pagination',
                    li: '',
                    a: '',
                    selected: 'active',
                    disabled: 'disabled'
                },
                icons: {
                    previous: '&lt;',
                    next: '&gt;',
                }
            }
        };
    }

    get(path){
        return get(this.properties, path);
    }

    set(path, value){
        set(this.properties, path, value);

        return this;
    }

    merge(settings){
        this.properties = this._mergeObjects(this.properties, settings);

        return this;
    }

    _mergeObjects(obj_1, obj_2){
        for(var key in obj_2){

            if(obj_2[key] === null){
                obj_1[key] = obj_2[key];

                continue;
            }else if(typeof obj_2[key] === 'object'){
                obj_1[key] = this._mergeObjects(obj_1[key], obj_2[key]);

                continue;
            }

            obj_1[key] = obj_2[key];
        }

        return obj_1;
    }
}

export default Settings;
