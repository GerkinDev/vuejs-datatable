import DatatableFactory from './index';
import Vue from 'vue';

Vue.use(DatatableFactory);
// The IIFE exposes the global `VuejsDatatable`. See the rollup config file & https://github.com/rollup/rollup/issues/494
export const VuejsDatatable = DatatableFactory;
