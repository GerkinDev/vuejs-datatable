import { Path } from 'object-path';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Column, IColumnDefinition } from '../../classes/column';
import { AHandler, ESortDir, IDisplayHandlerParam } from '../../classes/handlers';
import { Settings } from '../../classes/settings';
import { classValType, IDict, ensurePromise, mergeClassVals, TClassVal } from '../../utils';
import { VueDatatablePager } from '../vue-datatable-pager/vue-datatable-pager';

import template from './vue-datatable.html';

/**
 * Parameters passed to the `data` function, to handle by custom logic.
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
export type TDataFn<TRow extends {}> = ( ( search: IDataFnParams<TRow> ) => ITableContentParam<TRow> );

/**
 * The main component of the module, used to display a datatable.
 */
@Component( {
	...template,
} )
export class VueDatatable<TRow extends {}, TSub extends VueDatatable<TRow, TSub>> extends Vue {
	/** The name of the datatable. It should be unique per page. */
	@Prop( { type: String, default: 'default' } ) private readonly name!: string;
	/** Set to `true` to defer the initialization of the table after a pager has been attached. It may resolve issues related to double execution of data function. */
	@Prop( { type: Boolean, default: false } ) private readonly waitForPager!: boolean;
	/** List of columns definitions displayed by this datatable. */
	@Prop( { type: Array, required: true } ) private readonly columns!: Array<IColumnDefinition<TRow>>;
	/** The list of items to display, or a getter function. */
	@Prop( { required: true } ) private readonly data!: TRow[] | TDataFn<TRow> | unknown;
	/** Value to match in rows for display filtering. */
	@Prop( { type: [ String, Array ], default: null } ) private readonly filter!: string | string[];
	/** Class(es) or getter function to get row classes. */
	@Prop( { type: classValType.concat( [ Function ] ), default: null } ) private readonly rowClasses!: TClassVal | ( ( row: TRow ) => TClassVal ) | null;

	/** Column used for data sorting. */
	private sortBy: Column<TRow> | null = null;
	/** Direction of the sort. A null value is equivalent to 'asc'. */
	private sortDir: ESortDir | null = null;
	/** Total number of rows contained by this data table. */
	public totalRows = 0;
	/** Current page index. */
	public page = 1;
	/** Maximum number of rows displayed per page. */
	public perPage: number | null = null;
	/** Array of rows displayed by the table. */
	private displayedRows: TRow[] = [];
	/** Array of pagers that are linked to this table. */
	public readonly pagers: Array<VueDatatablePager<any>> = [];

	/** Array of columns definitions casted as {@link Column} objects. */
	private get normalizedColumns() {
		return this.columns.map( column => new Column( column ) );
	}
	/** Base CSS class to apply to the `&lt;table&gt;` element. */
	private get tableClass() {
		return this.settings.get( 'table.class' );
	}

	// Virtual properties
	/** Reference to the {@link Settings} object linked to this datatable instance. */
	protected static readonly settings: Settings;
	public get settings() {
		return ( this.constructor as typeof VueDatatable ).settings;
	}
	/** Reference to the {@link Handler} object linked to this datatable instance. */
	protected static readonly handler: AHandler<any, any, any, any, any>;
	public get handler() {
		return ( this.constructor as typeof VueDatatable ).handler;
	}
	/** A unique identifier of this table type's datatable */
	public static readonly identifier: string;
	public get identifier() {
		return ( this.constructor as typeof VueDatatable ).identifier;
	}

	public created() {
		this.$datatables[this.name] = this;
		this.$root.$emit( 'table.ready', this.name );
		this.$watch( 'data', this.processRows, { deep: true, immediate: false } );
		this.$watch( 'columns', this.processRows, { deep: true, immediate: false } );

		// Defer to next tick, so a pager component created just after have the time to link itself with this table before start watching.
		this.$nextTick( () => {
			if ( this.waitForPager && this.pagers.length === 0 ) {
				this.$on( 'table.pager-bound', () => this.initWatchCriterions() );
			} else {
				this.initWatchCriterions();
			}
		} );
	}

	/**
	 * Get the sort direction for a specific column.
	 *
	 * @param columnDefinition - The column to check sorting direction for.
	 * @returns the sort direction for the specified column.
	 */
	private getSortDirectionForColumn( columnDefinition: Column<TRow> ): ESortDir | null {
		if ( this.sortBy !== columnDefinition ) {
			return null;
		}

		return this.sortDir;
	}
	/**
	 * Defines the sort direction for a specific column.
	 *
	 * @param direction - The direction of the sort.
	 * @param column    - The column to check sorting direction for.
	 * @returns nothing.
	 */
	private setSortDirectionForColumn( direction: ESortDir | null, column: Column<TRow> ): void {
		this.sortBy = column;
		this.sortDir = direction;
	}
	
	/**
	 * Using data (or its return value if it is a function), filter, sort, paginate & display rows in the table.
	 *
	 * @returns a promise resolved once the processing is done, with nothing.
	 * @see DataFnParams Parameters provided to the `data` function.
	 * @tutorial ajax-data
	 */
	private processRows(): Promise<void> {
		if ( typeof this.data === 'function' ) {
			const params = {
				filter:  this.filter,
				page:    this.page,
				perPage: this.perPage,
				sortBy:  this.sortBy ? this.sortBy.field : null,
				sortDir: this.sortDir,
			};

			return ensurePromise( this.data( params ) )
				.then( tableContent => ensurePromise( this.setTableContent( tableContent ) ) );
		}

		const outObj: Partial<IDisplayHandlerParam<TRow, any, any, any, any>> = { source: this.data };
		return ensurePromise( this.handler.filterHandler( this.data, this.filter, this.normalizedColumns ) )
			.then( filteredData => ensurePromise( this.handler.sortHandler( outObj.filtered = filteredData, this.sortBy, this.sortDir ) ) )
			.then( sortedData => ensurePromise( this.handler.paginateHandler( outObj.sorted = sortedData, this.perPage, this.page ) ) )
			.then( pagedData => ensurePromise( this.handler.displayHandler( Object.assign( { paged: pagedData }, outObj ) as IDisplayHandlerParam<TRow, any, any, any, any> ) ) )
			.then( tableContent => ensurePromise( this.setTableContent( tableContent ) ) );
	}
	/**
	 * Defines the table content & total rows number. You can send none, a single, or both properties. Only non undefined prop will be set.
	 *
	 * @param content - The content to set.
	 * @returns nothing.
	 */
	private setTableContent( { rows, totalRowCount }: Partial<ITableContentParam<TRow>> = { rows: undefined, totalRowCount: undefined } ): void {
		this.setRows( rows );
		this.setTotalRowCount( totalRowCount );
	}
	/**
	 * Set the displayed rows.
	 *
	 * @param rows - The rows to display.
	 * @returns nothing.
	 */
	private setRows( rows?: TRow[] ): void {
		if ( typeof rows !== 'undefined' && rows !== null ) {
			this.displayedRows = rows;
		}
	}
	/**
	 * Set the displayed rows count.
	 *
	 * @param value - The number of displayed rows.
	 * @returns nothing.
	 */
	private setTotalRowCount( value?: number ): void {
		if ( typeof value !== 'undefined' && value !== null ) {
			this.totalRows = value;
		}
	}
	/**
	 * Get the classes to add on the row
	 *
	 * @param row - The row to get classes for.
	 * @returns the classes string to set on the row.
	 */
	private getRowClasses( row: TRow ): IDict<boolean> {
		const rowClasses = this.rowClasses || {};
		const settingsClass = this.settings.get( 'table.row.class' );

		if ( typeof rowClasses === 'function' ) {
			return mergeClassVals( settingsClass, rowClasses( row ) );
		}

		return mergeClassVals( rowClasses );
	}
	/**
	 * Starts the watching of following properties: `filter`, `perPage`, `page`, `sortBy`, `sortDir`.
	 * When a change is detected, the component runs {@link datatable#processRows}.
	 * Because the watch is immediate, {@link datatable#processRows} is run immediately when this method is called.
	 *
	 * @see datatable#processRows
	 * @see https://vuejs.org/v2/api/#vm-watch
	 * @returns nothing.
	 */
	private initWatchCriterions(): void {
		for ( const prop of [ 'filter', 'perPage', 'page', 'sortBy', 'sortDir' ] ) {
			this.$watch( prop, this.processRows, { immediate: false, deep: true } );
		}
		this.processRows();
	}
}
