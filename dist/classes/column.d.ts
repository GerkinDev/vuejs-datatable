import { Path } from 'object-path';
import Vue, { Component } from 'vue';
import { EColAlign, TClassVal } from '../utils';
/**
 * Description of a single column of a datatable.
 *
 * @typeParam TRow - The type of the item to bind on the row
 */
export interface IColumnDefinition<TRow> {
    /**
     * The alignment direction of the cells in this column.
     * Defaults to `'left'`
     */
    align?: EColAlign;
    /**
     * The alignment direction of the header of this column.
     * Defaults to `'center'`
     */
    headerAlign?: EColAlign;
    /**
     * The label displayed in the header.
     */
    label: string;
    /**
     * The name of the field in the row object.
     * You can use `representedAs` for further customization
     */
    field?: keyof TRow | Path;
    /**
     * Transformation function that returns the string to display
     *
     * @param row TRow - The current row to transform and display
     */
    representedAs?(row: TRow): string;
    /**
     * The component used to represent this cell
     */
    component?: string | typeof Vue | Component<any, any, any, {
        row?: TRow;
        column?: Column<TRow>;
    }>;
    /**
     * Set to true to convert the return value of `props.representedAs` to HTML.
     * Defaults to `false`
     */
    interpolate?: boolean;
    /**
     * Header cell component of the column.
     */
    headerComponent?: Vue;
    /**
     * Controls whetever this column can be sorted.
     * The default value depend on the column configuration.
     */
    sortable?: boolean;
    /**
     * Controls whetever this column can be filtered.
     * The default value depend on the column configuration.
     */
    filterable?: boolean;
    /**
     * The base CSS class to apply to the header component.
     */
    headerClass?: TClassVal;
    /**
     * The CSS class or a function returning CSS class(es) for cells of this column.
     */
    class?: TClassVal | ((row: TRow) => TClassVal);
}
/**
 * A class responsible for handling a full column with its header.
 */
export declare class Column<TRow extends {}> {
    /** The CSS class or a function returning CSS class(es) for cells of this column. */
    readonly class: TClassVal | ((row: TRow) => TClassVal) | null;
    /** The alignment direction of the cells in this column. */
    readonly align: EColAlign;
    /** The component used to represent this cell. */
    readonly component: Vue | null;
    /** The name of the field in the row object. */
    readonly field: keyof TRow | Path | null;
    /** A transformation function that returns the string to display */
    private readonly representedAs;
    /** Set to true to convert the return value of `props.representedAs` to HTML. */
    readonly interpolate = false;
    /** The alignment direction of the header of this column. */
    readonly headerAlign: EColAlign;
    /** The header cell component of the column. */
    readonly headerComponent?: Vue;
    /** The base CSS class to apply to the header component. */
    readonly headerClass = "";
    /** The label displayed in the header. */
    readonly label = "";
    /** Controls whetever this column can be sorted. */
    sortable: boolean;
    /** Controls whetever this column can be filtered. */
    filterable: boolean;
    constructor(props: IColumnDefinition<TRow>);
    /**
     * Normalize the alignment, using the requested default value.
     *
     * @param align        - The raw desired alignment
     * @param defaultAlign - The default alignment to use, if the 1st parameter isn't recognized
     * @returns the normalized alignment
     */
    static normalizeAlignment(align: string | EColAlign | undefined, defaultAlign?: EColAlign): EColAlign;
    /**
     * Check if the column use plain text value (eg `representedAs` or `field`, but not `component`)
     * If multiple representation props are provided, it is considered as plain text if there are alternatives to `component`
     *
     * @param props - The column definition object
     * @returns `true` if the column can be represented by plain text, `false` otherwise
     */
    static isPlainTextField(props: IColumnDefinition<any>): boolean;
    /**
     * Check if the column can be filtered.
     *
     * @param props - The column definition object
     * @returns `true` if the column can be filtered, `false` otherwise
     */
    static isFilterable(props: IColumnDefinition<any>): boolean;
    /**
     * Check if the column can be sorted.
     *
     * @param props - The column definition object
     * @returns `true` if the column can be sorted, `false` otherwise
     */
    static isSortable(props: IColumnDefinition<any>): boolean;
    /**
     * Converts a row to its string representation for the current column.
     *
     * @param row - The row to convert
     * @returns the string representation of this row in the current column.
     */
    getRepresentation(row: TRow): string;
    /**
     * Check if the provided row's representation matches a certain filter string.
     *
     * @param row          - The row to check.
     * @param filterString - The filter string to test.
     * @returns `true` if the row matches the filter, `false` otherwise.
     */
    matches(row: TRow, filterString: string): boolean;
}
