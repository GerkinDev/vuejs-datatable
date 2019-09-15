import Vue from 'vue';
import { VuejsDatatableFactory } from './vuejs-datatable.esm';
export * from './vuejs-datatable.esm';

// The IIFE exposes the global `VuejsDatatable`. See the rollup config file & https://github.com/rollup/rollup/issues/494
Vue.use( VuejsDatatableFactory );
