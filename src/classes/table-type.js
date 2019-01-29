import VueDatatable from '../vue-datatable.vue';
import VueDatatablePager from '../vue-datatable-pager.vue';
import Handler from './handler.js';
import Settings from './settings.js';

export default class TableType {
	constructor(id){
		this.id = id;

		this.handler = new Handler();
		this.settings = new Settings();
	}

	getId(){
		return this.id;
	}

	setFilterHandler(closure){
		this.handler.filterHandler = closure;

		return this;
	}

	setSortHandler(closure){
		this.handler.sortHandler = closure;

		return this;
	}

	setPaginateHandler(closure){
		this.handler.paginateHandler = closure;

		return this;
	}

	setDisplayHandler(closure){
		this.handler.displayHandler = closure;

		return this;
	}

	setting(path, value){
		if (value === undefined){
			return this.settings.get(path);
		}

		this.settings.set(path, value);

		return this;
	}

	mergeSettings(settings){
		this.settings.merge(settings);

		return this;
	}

	getTableDefinition(){
		const definition = this.clone(VueDatatable);
		definition.handler = this.handler;
		definition.settings = this.settings;
		definition.name = this.id;

		return definition;
	}

	getPagerDefinition(){
		const definition = this.clone(VueDatatablePager);
		definition.settings = this.settings;
		definition.name = this.id;

		return definition;
	}

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
