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
    
    export interface IDataCallbackOptions{
        page_number: number;
        page_length: number;
        sort_by: string;
    }
    export interface IVueDatatable extends Vue {
        processRows(): void;
    }
    export interface IColumnDefinition<TRow>{
        /**
         * Text in the heading element
         */
        label: string;
        /**
         * Name of the field to get.
         * You can use `representedAs` for further customization
         */
        field?: string;
        /**
         * Apply a function on the row to generate the displayed content
         * 
         * @param row TRow - The current row to transform and display
         */
        representedAs?(row: TRow): string;

        /**
         * Enable sorting on this field.
         * Default value depends on the type of the field.
         */
        sortable?: boolean;

        /**
         * Parse HTML of the content
         * Defaults to `false`
         */
        interpolate?: boolean;
    }
}
