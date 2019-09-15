import { Path } from 'object-path';
import { Vue } from 'vue-property-decorator';
import { TableType } from '../../classes';
import { Column, IColumnDefinition } from '../../classes/column';
import { ESortDir } from '../../classes/handlers';
import { TClassVal } from '../../utils';
import { VueDatatablePager } from '../vue-datatable-pager/vue-datatable-pager';
/**
 * Parameters passed to the `data` function, to handle by custom logic.
 *
 * @tutorial ajax-data
 */
export interface IDataFnParams<TRow extends {}> {
    filter: string | string[];
    sortBy: Path | keyof TRow;
    sortDir: ESortDir;
    perPage: number;
    page: number;
}
export interface ITableContentParam<TRow extends {}> {
    rows: TRow[];
    totalRowCount: number;
}
export declare type TDataFn<TRow extends {}> = ((search: IDataFnParams<TRow>) => ITableContentParam<TRow>);
export declare type TColumnsDefinition<TRow extends {}> = Array<IColumnDefinition<TRow>>;
/**
 * The main component of the module, used to display a datatable.
 */
export declare class VueDatatable<TRow extends {}, TSub extends VueDatatable<TRow, TSub>> extends Vue {
    /**
     * The name of the datatable. It should be unique per page.
     *
     * @vue Prop
     */
    readonly name: string;
    /**
     * Set to `true` to defer the initialization of the table after a pager has been attached. It may resolve issues related to double execution of data function.
     *
     * @vue Prop
     */
    readonly waitForPager: boolean;
    /**
     * List of columns definitions displayed by this datatable.
     *
     * @vue Prop
     */
    readonly columns: TColumnsDefinition<TRow>;
    /**
     * The list of items to display, or a getter function.
     *
     * @vue Prop
     */
    readonly data: TRow[] | TDataFn<TRow> | unknown;
    /**
     * Value to match in rows for display filtering.
     *
     * @vue Prop
     */
    readonly filter: string | string[];
    /**
     * Maximum number of rows displayed per page.
     *
     * @vue Prop
     */
    readonly perPage: number;
    /**
     * Class(es) or getter function to get row classes.
     *
     * @vue Prop
     */
    readonly rowClasses: TClassVal | ((row: TRow) => TClassVal) | null;
    /** Column used for data sorting. */
    private sortBy;
    /** Direction of the sort. A null value is equivalent to 'asc'. */
    private sortDir;
    /** Current page index. */
    page: number;
    /** Total number of rows contained by this data table. */
    totalRows: number;
    /** The total number of pages in the associated [[datatable]]. */
    private readonly totalPages;
    /** Array of rows displayed by the table. */
    displayedRows: TRow[];
    /** Array of pagers that are linked to this table. */
    readonly pagers: Array<VueDatatablePager<any>>;
    /** Array of columns definitions casted as [[Column]] objects. */
    readonly normalizedColumns: Column<TRow>[];
    /** Base CSS class to apply to the `&lt;table&gt;` element. */
    readonly tableClass: string;
    protected readonly tableType: TableType<any>;
    readonly handler: import("../../classes").IHandler<any, any[], any[], any[], any[]>;
    readonly identifier: string;
    /**
     * Register the table in the global registry of tables.
     * Additionnaly, it may wait for a pager before starting watch data properties.
     *
     * @emits vuejs-datatable::ready Emitted with the table name
     */
    created(): void;
    /**
     * Get the sort direction for a specific column.
     *
     * @param columnDefinition - The column to check sorting direction for.
     * @returns the sort direction for the specified column.
     */
    getSortDirectionForColumn(columnDefinition: Column<TRow>): ESortDir | null;
    /**
     * Defines the sort direction for a specific column.
     *
     * @param direction - The direction of the sort.
     * @param column    - The column to check sorting direction for.
     * @returns nothing.
     */
    setSortDirectionForColumn(direction: ESortDir | null, column: Column<TRow>): void;
    /**
     * Internal function that retrieve data rows to display.
     *
     * @returns Promise resolved with total rows count and/or rows to display
     */
    private processRowsIn;
    /**
     * Using data (or its return value if it is a function), filter, sort, paginate & display rows in the table.
     *
     * @returns a promise resolved once the processing is done, with nothing.
     * @see DataFnParams Parameters provided to the `data` function.
     * @tutorial ajax-data
     */
    processRows(): Promise<void>;
    /**
     * Defines the table content & total rows number. You can send none, a single, or both properties. Only non undefined prop will be set.
     *
     * @param content - The content to set.
     * @returns nothing.
     */
    private setTableContent;
    /**
     * Propagate the `page-changed` event when the page data is changed.
     *
     * @emits vuejs-datatable::page-changed
     */
    emitNewPage(): number;
    /**
     * Get the classes to add on the row
     *
     * @param row - The row to get classes for.
     * @returns the classes string to set on the row.
     */
    getRowClasses(row: TRow): string[];
    /**
     * Starts the watching of following properties: `filter`, `perPage`, `page`, `sortBy`, `sortDir`.
     * When a change is detected, the component runs [[datatable#processRows]].
     * Because the watch is immediate, [[datatable#processRows]] is run immediately when this method is called.
     *
     * @see datatable#processRows
     * @see https://vuejs.org/v2/api/#vm-watch
     * @returns nothing.
     */
    private initWatchCriterions;
    /**
     * Recalculates the new page count, and emit `page-count-changed` with the new count.
     *
     * @emits vuejs-datatable::page-count-changed
     */
    refreshPageCount(): number | null;
    /**
     * Recalculates the new page count, and emit `page-count-changed` with the new count.
     *
     * @emits vuejs-datatable::page-count-changed
     */
    refreshPage(): number;
}
