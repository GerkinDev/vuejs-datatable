import Vue from 'vue';
import { VuejsDatatableFactory } from './index-esm';

Vue.use( VuejsDatatableFactory );
// The IIFE exposes the global `VuejsDatatable`. See the rollup config file & https://github.com/rollup/rollup/issues/494
export const VuejsDatatable = VuejsDatatableFactory;
