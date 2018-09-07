declare module 'vuejs-datatable'{
    import Vue, { PluginFunction, PluginObject } from 'vue';

    class DatatableFactory implements PluginObject<{}> {
        [key: string]: any;
        public install: PluginFunction<{}>;
    }
    const VuePlugin: DatatableFactory;

    export default VuePlugin;
}
