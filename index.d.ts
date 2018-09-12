// Type definitions for vuejs-datatable 1.5.3
// Project: vue-datatable
// Definitions by: GerkinDev <https://github.com/gerkinDev/>

declare module 'vuejs-datatable'{
    import Vue, { PluginFunction, PluginObject } from 'vue';

    class DatatableFactory implements PluginObject<{}> {
        [key: string]: any;
        public install: PluginFunction<{}>;
    }
    const VuePlugin: DatatableFactory;

    export default VuePlugin;
}
