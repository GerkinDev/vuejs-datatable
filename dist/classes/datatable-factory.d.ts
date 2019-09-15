import Vue, { PluginObject } from 'vue';
import { TableType } from './table-type';
/**
 * Registers Vuejs-Datatable components globally in VueJS.
 *
 * @example
 * import { DatatableFactory } from 'vuejs-datatable';
 * const myDatatableFactory = new DatatableFactory()
 *     .registerTableType( new TableType( 'my-table', {}) )
 * Vue.use( myDatatableFactory );
 */
export declare class DatatableFactory implements PluginObject<void> {
    /** A reference to the Vue instance the plugin is installed in. It may be used to check if the factory was already installed */
    private vueInstance?;
    /** Registry of declared table types. */
    private readonly tableTypes;
    /** The default table type to use if no other configuration was provided. */
    private readonly defaultTableType;
    /**
     * Initialize the default factory
     */
    constructor();
    /**
     * Get a table type by its identifier.
     *
     * @param id - The identifier of the table type. If not provided, it will default to the default table type.
     * @returns the table type registered with that identifier.
     */
    getTableType(id?: string): TableType<any> | undefined;
    /**
     * Controls the use of the default table type.
     *
     * @param use - `true` to use the default type, `false` otherwise.
     * @returns `this` for chaining.
     */
    useDefaultType(use: boolean): this;
    /**
     * Check if the factory uses the default table type.
     *
     * @returns a boolean indicating if the factory uses the default table type.
     */
    useDefaultType(): boolean;
    /**
     * Creates a new table type with a specified prefix, that you can customize using a callback.
     *
     * @param nameOrTableType - The name of the component to register, or a [[TableType]] object.
     * @param callback        - An optional function to execute, that configures the newly created [[TableType]]. It takes a single parameter: the newly created [[TableType]], and should
     * return the transformed table type.
     * @returns `this` for chaining.
     */
    registerTableType<TRow extends {} = {}, TSource = TRow[], TFiltered = TRow[], TSorted = TRow[], TPaged = TRow[]>(nameOrTableType: string | TableType<TRow, TSource, TFiltered, TSorted, TPaged>, callback?: (tableType: TableType<TRow, TSource, TFiltered, TSorted, TPaged>) => TableType<TRow, TSource, TFiltered, TSorted, TPaged> | undefined): this;
    /**
     * Creates a new table type with a specified prefix, that you can customize using a callback.
     *
     * @param nameOrTableType - The name of the component to register, or a [[TableType]] object.
     * @returns `this` for chaining.
     */
    deregisterTableType(nameOrTableType: string | TableType<any>): this;
    /**
     * Declares global components exported by vuejs-datatable, & load configs.
     *
     * @param Vue - The Vue instance to configure.
     * @returns nothing.
     */
    install(vue: typeof Vue): void;
    /**
     * Declares a pair of components (a Datatable & a Datatable-Pager) sharing a config.
     *
     * @param id        - The base name of the datatable type.
     * @param tableType - The configuration object that describes both datatable & the related pager.
     * @returns `this` for chaining.
     */
    private installTableType;
    /**
     * Remove a table type definition from vue (the datatable & its associated pager).
     * This should be used carefully, because Vue won't be able to instanciate new instances of this table type.
     *
     * @param id - The base name of the datatable type to forget.
     * @returns `this` for chaining.
     */
    private uninstallTableType;
}
