import { TMaybePromise } from '../../utils';
import { Column } from '../column';
import { ESortDir, IDisplayHandlerParam, IDisplayHandlerResult, IHandler } from './i-handler';
/**
 * This handler is an implementation of [[IHandler]], configured to manipulate an array of rows as input.
 * Handlers are called in this order: filter, sort, paginate, display.
 *
 * In case you are overriding *one* of those handlers, make sure that its return value is compatible with subsequent handlers. Otherwise, you'll require to override all of them.
 *
 * @tutorial ajax-handler
 */
export declare class DefaultHandler<TRow extends {}> implements IHandler<TRow, TRow[], TRow[], TRow[], TRow[]> {
    /**
     * Filter the provided rows, checking if at least a cell contains one of the specified filters.
     *
     * @param data    - The data to apply filter on.
     * @param filters - The strings to search in cells.
     * @param columns - The columns of the table.
     * @returns the filtered data rows.
     */
    filterHandler(data: TRow[], filters: string[] | string | undefined, columns: Array<Column<TRow>>): TMaybePromise<TRow[]>;
    /**
     * Sort the given rows depending on a specific column & sort order.
     *
     * @param filteredData - Data outputed from [[Handler.filterHandler]].
     * @param sortColumn   - The column used for sorting.
     * @param sortDir      - The direction of the sort.
     * @returns the sorted rows.
     */
    sortHandler(filteredData: TRow[], sortColumn: Column<TRow> | null, sortDir: ESortDir | null): TMaybePromise<TRow[]>;
    /**
     * Split the rows list to display the requested page index.
     *
     * @param sortedData - Data outputed from [[Handler.sortHandler]].
     * @param perPage    - The total number of items per page.
     * @param pageNumber - The index of the page to display.
     * @returns the requested page's rows.
     */
    paginateHandler(sortedData: TRow[], perPage: number | null, pageNumber: number): TMaybePromise<TRow[]>;
    /**
     * Handler to post-process the paginated data, and determine which data to actually display.
     *
     * @param processSteps - The result of each processing steps, stored in an object. Each step is the result of one of the processing function
     * @returns the processed values to set on the datatable.
     */
    displayHandler({ sorted, paged }: IDisplayHandlerParam<TRow, TRow[], TRow[], TRow[], TRow[]>): TMaybePromise<IDisplayHandlerResult<TRow>>;
    /**
     * Check if the provided row contains the filter string in *any* column.
     *
     * @param row          - The data row to search in.
     * @param filterString - The string to match in a column.
     * @param columns      - The list of columns in the table.
     * @returns `true` if any column contains the searched string.
     */
    rowMatches(row: TRow, filterString: string, columns: Array<Column<TRow>>): boolean;
}
