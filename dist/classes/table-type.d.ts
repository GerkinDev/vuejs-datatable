import { Path } from 'object-path';
import { IHandler, TDisplayHandler, TFilterHandler, TPaginateHandler, TSortHandler } from './handlers';
import { DeepPartial, ISettingsProperties, Settings } from './settings';
import { VueDatatablePager } from '../components/vue-datatable-pager/vue-datatable-pager';
import { VueDatatable } from '../components/vue-datatable/vue-datatable';
/**
 * Defines a type of Datatable, with its [[Settings]] object.
 */
export declare class TableType<TRow extends {}, TSource = TRow[], TFiltered = TRow[], TSorted = TRow[], TPaged = TRow[]> {
    readonly id: string;
    readonly handler: IHandler<TRow, TSource, TFiltered, TSorted, TPaged>;
    /** Settings object used to get various values for the datatable & other components */
    readonly settings: Settings;
    get tableTypeConsumer(): import("vue").VueConstructor<import("vue-property-decorator").Vue> & (new () => import("../components/mixins/table-type-consumer-factory").ITableTypeConsumer);
    /**
     * Creates a new datatable type, instanciating a new [[Settings]] object.
     *
     * @param id      - The identifier of this datatable type
     * @param handler - Transformation functions to use for table operations
     */
    constructor(id: string, handler?: IHandler<TRow, TSource, TFiltered, TSorted, TPaged>);
    /**
     * Override the table type's handler method with the provided one. It can be used to override a single handler step, or to change the behavior of a table type at runtime.
     *
     * @param type    - The type of the handler (`'filter' | 'sort' | 'paginate' | 'display'`)
     * @param closure - The new handler to set.
     */
    private setHandler;
    /**
     * Defines the function used to filter data
     *
     * @see Handler#filterHandler
     * @tutorial ajax-handler
     * @param closure - The function to use for sorting.
     * @returns `this` for chaining.
     */
    setFilterHandler: (closure: TFilterHandler<TRow, TSource, TFiltered>) => this;
    /**
     * Defines the function used to sort data
     *
     * @see Handler#sortHandler
     * @tutorial ajax-handler
     * @param closure - The function to use for sorting.
     * @returns `this` for chaining.
     */
    setSortHandler: (closure: TSortHandler<TRow, TFiltered, TSorted>) => this;
    /**
     * Defines the function used to paginate data
     *
     * @see Handler#paginateHandler
     * @tutorial ajax-handler
     * @param closure - The function to use for pagination.
     * @returns `this` for chaining.
     */
    setPaginateHandler: (closure: TPaginateHandler<TRow, TSorted, TPaged>) => this;
    /**
     * Defines the function used to paginate data
     *
     * @see Handler#displayHandler
     * @tutorial ajax-handler
     * @param closure - The function to use to post-process processed steps & extract rows & total count.
     * @returns `this` for chaining.
     */
    setDisplayHandler: (closure: TDisplayHandler<TRow, TSource, TFiltered, TSorted, TPaged>) => this;
    /**
     * Set a [[Settings]] value at a specific path.
     *
     * @param path  - Path to the setting value to set.
     * @param value - Value to set at the specified path.
     * @returns `this` for chaining.
     */
    setting(path: Path, value: any): this;
    /**
     * Get a [[Settings]] value at a specific path.
     *
     * @param path - Path to the setting value to get.
     * @returns the value at the given path.
     */
    setting(path: Path): any;
    /**
     * Merge a settings object with the [[TableType.setting]] object of the instance.
     *
     * @param settings - Values to merge.
     * @returns `this` for chaining.
     */
    mergeSettings(settings: DeepPartial<ISettingsProperties>): this;
    /**
     * Factory function that copy the [[VueDatatable]] prototype, and configure as this type.
     *
     * @returns a new factored [[VueDatatable]] constructor.
     */
    getTableDefinition(): typeof VueDatatable;
    /**
     * Factory function that copy the [[VueDatatablePager]] prototype, and configure as this type.
     *
     * @returns a new factored [[VueDatatablePager]] constructor.
     */
    getPagerDefinition(): typeof VueDatatablePager;
}
