import { Path } from 'object-path';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

import { TableType } from '../../classes';
import { Column, IColumnDefinition } from '../../classes/column';
import { ESortDir, IDisplayHandlerParam, IDisplayHandlerResult } from '../../classes/handlers';
import { classValType, ensurePromise, mergeClassVals, namespaceEvent, TClassVal, TMaybePromise } from '../../utils';
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
export type TColumnsDefinition<TRow extends {}> = Array<IColumnDefinition<TRow>>;

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
	/** Maximum number of rows displayed per page. */
	@Prop( { type: Number, default: Infinity } ) private readonly perPage!: number;
	/** Class(es) or getter function to get row classes. */
	@Prop( { type: classValType.concat( [ Function ] ), default: null } ) private readonly rowClasses!: TClassVal | ( ( row: TRow ) => TClassVal ) | null;

	/** Column used for data sorting. */
	private sortBy: Column<TRow> | null = null;
	/** Direction of the sort. A null value is equivalent to 'asc'. */
	private sortDir: ESortDir | null = null;

	// Pagination-related props & methods

	/** Current page index. */
	public page = 1;
	/** Total number of rows contained by this data table. */
	public totalRows = 0;

	/** The total number of pages in the associated {@link datatable}. */
	private get totalPages(): number | null {
		if ( this.totalRows <= 0 || this.perPage <= 0 ) {
			return 0;
		} else if ( !isFinite( this.perPage ) ) {
			return 1;
		}

		return Math.ceil( this.totalRows / this.perPage );
	}

	/** Array of rows displayed by the table. */
	public displayedRows: TRow[] = [];
	/** Array of pagers that are linked to this table. */
	public readonly pagers: Array<VueDatatablePager<any>> = [];

	/** Array of columns definitions casted as {@link Column} objects. */
	public get normalizedColumns() {
		return this.columns.map( column => new Column( column ) );
	}
	/** Base CSS class to apply to the `&lt;table&gt;` element. */
	public get tableClass() {
		return this.tableType.setting( 'table.class' );
	}

	protected readonly tableType!: TableType<any>;
	public get handler() {
		return this.tableType.handler;
	}
	public get identifier() {
		return this.tableType.id;
	}

	/**
	 * Register the table in the global registry of tables.
	 * Additionnaly, it may wait for a pager before starting watch data properties.
	 *
	 * @emit vuejs-datatable::ready Emitted with the table name
	 */
	public created() {
		this.$datatables[this.name] = this;
		this.$root.$emit( namespaceEvent( 'ready' ), this.name );

		// Defer to next tick, so a pager component created just after have the time to link itself with this table before start watching.
		this.$nextTick( () => {
			if ( this.waitForPager && this.pagers.length === 0 ) {
				this.$on( namespaceEvent( 'pager-bound' ), () => this.initWatchCriterions() );
			} else {
				// tslint:disable-next-line: no-floating-promises
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
	public getSortDirectionForColumn( columnDefinition: Column<TRow> ): ESortDir | null {
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
	public setSortDirectionForColumn( direction: ESortDir | null, column: Column<TRow> ): void {
		this.sortBy = column;
		this.sortDir = direction;
	}

	/**
	 * Internal function that retrieve data rows to display.
	 *
	 * @returns Promise resolved with total rows count and/or rows to display
	 */
	private processRowsIn(): TMaybePromise<IDisplayHandlerResult<TRow>> {
		if ( typeof this.data === 'function' ) {
			const params = {
				filter:  this.filter,
				page:    this.page,
				perPage: this.perPage,
				sortBy:  this.sortBy ? this.sortBy.field : null,
				sortDir: this.sortDir,
			};

			return this.data( params );
		} else {
			const outObj: Partial<IDisplayHandlerParam<TRow, any, any, any, any>> = { source: this.data };
			return ensurePromise( this.handler.filterHandler( this.data as any, this.filter, this.normalizedColumns ) )
				.then( filteredData => ensurePromise( this.handler.sortHandler( outObj.filtered = filteredData, this.sortBy, this.sortDir ) ) )
				.then( sortedData => ensurePromise( this.handler.paginateHandler( outObj.sorted = sortedData, this.perPage, this.page ) ) )
				.then( pagedData => ensurePromise( this.handler.displayHandler( { ...outObj, paged: pagedData } as IDisplayHandlerParam<TRow, any, any, any, any> ) ) );
		}
	}

	/**
	 * Using data (or its return value if it is a function), filter, sort, paginate & display rows in the table.
	 *
	 * @returns a promise resolved once the processing is done, with nothing.
	 * @see DataFnParams Parameters provided to the `data` function.
	 * @tutorial ajax-data
	 */
	@Watch( 'data', { deep: true, immediate: false } )
	@Watch( 'columns', { deep: true, immediate: false } )
	public processRows(): Promise<void> {
		return ensurePromise( this.processRowsIn() )
			.then( tableContent => this.setTableContent( tableContent ) );
	}

	/**
	 * Defines the table content & total rows number. You can send none, a single, or both properties. Only non undefined prop will be set.
	 *
	 * @param content - The content to set.
	 * @returns nothing.
	 */
	private setTableContent( { rows, totalRowCount }: Partial<ITableContentParam<TRow>> = {} ): void {
		if ( typeof rows === 'object' ) {
			this.displayedRows = rows;
		}
		if ( typeof totalRowCount === 'number' ) {
			this.totalRows = totalRowCount;
		}
	}

	/**
	 * Propagate the `page-changed` event when the page data is changed.
	 */
	@Watch( 'page', { immediate: true } )
	@Emit( namespaceEvent( 'page-changed' ) )
	public emitNewPage() {
		return this.page;
	}

	/**
	 * Get the classes to add on the row
	 *
	 * @param row - The row to get classes for.
	 * @returns the classes string to set on the row.
	 */
	public getRowClasses( row: TRow ): string[] {
		const rowClasses = typeof this.rowClasses === 'function' ? this.rowClasses( row ) : this.rowClasses;
		const settingsClass = this.tableType.setting( 'table.row.class' );

		return mergeClassVals( settingsClass, rowClasses );
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
	private initWatchCriterions(): Promise<void> {
		for ( const prop of [ 'filter', 'perPage', 'page', 'sortBy', 'sortDir' ] ) {
			this.$watch( prop, this.processRows, { immediate: false, deep: true } );
		}
		return this.processRows();
	}

	/**
	 * Recalculates the new page count, and emit `page-count-changed` with the new count.
	 *
	 * @emits 'page-count-changed'
	 */
	@Watch( 'totalRows' )
	@Watch( 'perPage' )
	@Emit( namespaceEvent( 'page-count-changed' ) )
	public refreshPageCount() {
		return this.totalPages;
	}

	/**
	 * Recalculates the new page count, and emit `page-count-changed` with the new count.
	 *
	 * @emits 'page-count-changed'
	 */
	@Watch( 'page' )
	@Emit( namespaceEvent( 'page-changed' ) )
	public refreshPage() {
		return this.page;
	}
}
