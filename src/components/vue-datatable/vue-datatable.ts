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
export type TDataFn<TRow extends {}> = ( ( search: IDataFnParams<TRow> ) => ITableContentParam<TRow> );
export type TColumnsDefinition<TRow extends {}> = Array<IColumnDefinition<TRow>>;

interface IPageRange {
	/** Index of the first element of the page. 1-indexed */
	from: number;
	/** Index of the last element of the page. 1-indexed */
	to: number;
	/** The total number of items */
	of: number;
}

/**
 * The main component of the module, used to display a datatable.
 *
 * @vue-slot no-results Shown only if no rows are displayed
 *
 * @vue-slot default Used to render each row
 * @vue-slot-param default row <TRow> - The current row to display.
 * @vue-slot-param default index <number> - The current row index.
 * @vue-slot-param default columns <Column[]> - The list of columns.
 *
 * @vue-slot footer Displayed at the bottom of the table.
 * @vue-slot-param footer rows <TRow[]> - The current list of displayed rows.
 * @vue-slot-param footer pagination <IPageRange> - The current pagination range of the table.
 * @vue-slot-param footer columns <Column[]> - The list of columns.
 */
@Component( {
	...template,
} )
export class VueDatatable<TRow extends {}, TSub extends VueDatatable<TRow, TSub>> extends Vue {
	/**
	 * The name of the datatable. It should be unique per page.
	 *
	 * @vue-prop
	 */
	@Prop( { type: String, default: 'default' } ) public readonly name!: string;

	/**
	 * Set to `true` to defer the initialization of the table after a pager has been attached. It may resolve issues related to double execution of data function.
	 *
	 * @vue-prop
	 */
	@Prop( { type: Boolean, default: false } ) public readonly waitForPager!: boolean;

	/**
	 * List of columns definitions displayed by this datatable.
	 *
	 * @vue-prop
	 */
	@Prop( { type: Array, required: true } ) public readonly columns!: TColumnsDefinition<TRow>;

	/**
	 * The list of items to display, or a getter function.
	 *
	 * @vue-prop
	 */
	@Prop( { required: true } ) public readonly data!: TRow[] | TDataFn<TRow> | unknown;

	/**
	 * Value to match in rows for display filtering.
	 *
	 * @vue-prop
	 */
	@Prop( { type: [ String, Array ], default: null } ) public readonly filter!: string | string[];

	/**
	 * Maximum number of rows displayed per page.
	 *
	 * @vue-prop
	 */
	@Prop( { type: Number, default: Infinity } ) public readonly perPage!: number;

	/**
	 * Class(es) or getter function to get row classes.
	 *
	 * @vue-prop
	 */
	@Prop( { type: classValType.concat( [ Function ] ), default: null } ) public readonly rowClasses!: TClassVal | ( ( row: TRow ) => TClassVal ) | null;

	/** Column used for data sorting. */
	private sortBy: Column<TRow> | null = null;
	/** Direction of the sort. A null value is equivalent to 'asc'. */
	private sortDir: ESortDir | null = null;

	// Pagination-related props & methods

	/** Current page index. */
	public page = 1;
	/** Total number of rows contained by this data table. */
	public totalRows = 0;

	/** The total number of pages in the associated [[datatable]]. */
	private get totalPages(): number | null {
		if ( this.totalRows <= 0 || this.perPage <= 0 ) {
			return 0;
		} else if ( !isFinite( this.perPage ) ) {
			return 1;
		}

		return Math.ceil( this.totalRows / this.perPage );
	}

	public get currentPageRange(): IPageRange {
		if ( this.perPage === Infinity ) {
			return {
				from: 1,
				of: this.totalRows,
				to: this.totalRows + 1,
			};
		} else {
			return {
				from: Math.min( ( ( this.page - 1 ) * this.perPage ) + 1, Math.max( this.totalRows, 1 ) ),
				of: this.totalRows,
				to: Math.min( this.page * this.perPage, this.totalRows + 1 ),
			};
		}
	}

	/** Array of rows displayed by the table. */
	public displayedRows: TRow[] = [];
	/** Array of pagers that are linked to this table. */
	public readonly pagers: Array<VueDatatablePager<any>> = [];

	/** Array of columns definitions casted as [[Column]] objects. */
	public get normalizedColumns() {
		return this.columns.map( column => new Column( column ) );
	}
	/** Base CSS class to apply to the `&lt;table&gt;` element. */
	public get tableClass() {
		return mergeClassVals( this.tableType.setting( 'table.class' ), this.$attrs.class )
			.join( ' ' );
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
	 * @vue-event vuejs-datatable::ready Emitted when the table has been initialized.
	 * @vue-event-param vuejs-datatable::ready tableName <string> - The table name.
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
	 *
	 * @vue-event vuejs-datatable::page-changed Emitted when the page has changed.
	 * @vue-event-param vuejs-datatable::page-changed newPage <number> - The index of the new page.
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
	 * When a change is detected, the component runs [[datatable#processRows]].
	 * Because the watch is immediate, [[datatable#processRows]] is run immediately when this method is called.
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
	 * @vue-event vuejs-datatable::page-count-changed Emitted when the page count has changed.
	 * @vue-event-param vuejs-datatable::page-count-changed newCount <number> - The new total number of pages.
	 */
	@Watch( 'totalRows' )
	@Watch( 'perPage' )
	@Emit( namespaceEvent( 'page-count-changed' ) )
	public refreshPageCount() {
		return this.totalPages;
	}

	/**
	 * Re-emit the current page.
	 *
	 * @vue-event vuejs-datatable::page-changed
	 */
	@Watch( 'page' )
	@Emit( namespaceEvent( 'page-changed' ) )
	public refreshPage() {
		return this.page;
	}
}
