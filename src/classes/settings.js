import {
	get, set, 
} from 'object-path';

export default class Settings {
	constructor(){
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
