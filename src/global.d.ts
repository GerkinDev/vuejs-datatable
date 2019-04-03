import Vue from 'vue';

import { IDict } from './utils';
import { VueDatatable } from './components/vue-datatable/vue-datatable';

// see https://stackoverflow.com/questions/48076772/typescript-add-properties-to-vue-library-definitions
declare module 'vue/types/vue' {
	interface Vue {
		$datatables: IDict<VueDatatable<any, any>>;
	}
}
