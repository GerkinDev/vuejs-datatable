import { TMaybePromise } from '../../utils';
import { Column } from '../column';
/**
 * Represents the sort direction of a column, eg ascending or descending
 */
export declare const enum ESortDir {
    Asc = "asc",
    Desc = "desc"
}
export interface IDisplayHandlerResult<TRow extends {}> {
    /** The actual rows to display */
    rows: TRow[];
    /** The total number of rows in the table. It counts also items on other pages. The pages in the pagination component are calculated using this value. */
    totalRowCount: number;
}
export interface IDisplayHandlerParam<TRow extends {}, TSource, TFiltered, TSorted, TPaged> {
    /** The original [[Datatable.data]] property of the datatable. */
    source: TRow[] | TSource;
    /** The return value of [[Handler.filterHandler]]. */
    filtered: TRow[] | TFiltered;
    /** The return value of [[Handler.sortHandler]]. */
    sorted: TRow[] | TSorted;
    /** The return value of [[Handler.paginateHandler]]. */
    paged: TRow[] | TPaged;
}
export declare type TFilterHandler<TRow extends {}, TIn = TRow[], TOut = TRow[]> = (data: TIn, filters: string | string[], columns: Array<Column<TRow>>) => TMaybePromise<TOut>;
export declare type TSortHandler<TRow, TIn = TRow[], TOut = TRow[]> = (filteredData: TIn, sortColumn: Column<TRow> | null, sortDir: ESortDir | null) => TMaybePromise<TOut>;
export declare type TPaginateHandler<TRow, TIn = TRow[], TOut = TRow[]> = (sortedData: TIn, perPage: number | null, pageNumber: number) => TMaybePromise<TOut>;
export declare type TDisplayHandler<TRow, TSource = TRow[], TFiltered = TRow[], TSorted = TRow[], TPaged = TRow[]> = (operationResults: IDisplayHandlerParam<TRow, TSource, TFiltered, TSorted, TPaged>) => TMaybePromise<IDisplayHandlerResult<TRow>>;
/**
 * This interface exposes methods used to manipulate table data, like filtering, sorting, or paginating.
 * You can implement this interface, or override [[DefaultHandler]]'s instance's members to customize the behavior of your [[VueDatatable]].
 * Handlers are called in this order: filter, sort, paginate, display.
 *
 * @tutorial ajax-handler
 */
export interface IHandler<TRow extends {}, TSource = TRow[], TFiltered = TRow[], TSorted = TRow[], TPaged = TRow[]> {
    /** Filter the provided rows, checking if at least a cell contains one of the specified filters. It supports promises. Defaults to [[Handler.defaultFilterHandler]]. */
    filterHandler: TFilterHandler<TRow, TSource, TFiltered>;
    /** Sort the given rows depending on a specific column & sort order. It suports promises. Defaults to [[Handler.defaultSortHandler]].  */
    sortHandler: TSortHandler<TRow, TFiltered, TSorted>;
    /** Split the rows list to display the requested page index. It supports promises. Defaults to [[Handler.defaultPaginateHandler]]. */
    paginateHandler: TPaginateHandler<TRow, TSorted, TPaged>;
    /** Handler to post-process the paginated data, and determine which data to actually display. It supports promises. Defaults to [[Handler.defaultDisplayHandler]]. */
    displayHandler: TDisplayHandler<TRow, TSource, TFiltered, TSorted, TPaged>;
}
