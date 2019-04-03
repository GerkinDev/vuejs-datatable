import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';

import { Settings } from '../../classes';
import { VueDatatable } from '../vue-datatable/vue-datatable';

import template from './vue-datatable-pager.html';

export enum EPagerType {
	Short = 'short',
	Abbreviated = 'abbreviated',
	Long = 'long',
}

/**
 * The component that is used to manage & change pages on a {@link datatable}.
 */
@Component( {
	...template,
} )
export class VueDatatablePager<TSub extends VueDatatablePager<TSub>> extends Vue {
	/** The page index to display */
	@Model( 'change', { type: Number, default: 1 } ) private readonly page!: number;

	/** The id of the associated {@link datatable}. */
	@Prop( { type: String, default: 'default' } ) private readonly table!: string;
	/** The kind of the pager */
	@Prop( { type: String, default: EPagerType.Long } ) private readonly type!: EPagerType;
	/** Max number of items to display. */
	@Prop( { type: Number, default: 10 } ) private readonly perPage!: number;

	private ptableInstance: VueDatatable<any, any> | null = null;
	public get tableInstance(): VueDatatable<any, any> {
		if ( !this.ptableInstance ) {
			throw new ReferenceError( 'Invalid operation: the pager must be attached to a table.' );
		}
		return this.ptableInstance;
	}

	/** Returns `true` if the pager has an associated {@link datatable} with some rows. */
	public get show(): boolean {
		return this.ptableInstance !== null && this.totalRows > 0;
	}
	/** The total number of rows in the associated {@link datatable}. */
	private get totalRows(): number {
		try {
			return this.tableInstance.totalRows;
		} catch {
			return 0;
		}
	}
	/** HTML class on the wrapping `ul` around the pager buttons. */
	public get paginationClass(): string {
		return this.settings.get( 'pager.classes.pager' );
	}
	/** The total number of pages in the associated {@link datatable}. */
	private get totalPages(): number | null {
		if ( this.totalRows <= 0 || this.perPage <= 0 ) {
			return null;
		}

		return Math.ceil( this.totalRows / this.perPage );
	}
	/** HTML content of the previous page's button. */
	private get previousIcon(): string {
		return this.settings.get( 'pager.icons.previous' );
	}
	/** HTML content of the next page's button. */
	private get nextIcon(): string {
		return this.settings.get( 'pager.icons.next' );
	}

	// @Watch( 'totalRows' )
	// @Watch( 'perPage' )
	@Watch( 'totalPages' )
	private onTotalPageChange() {
		if ( this.totalPages !== null && this.page > this.totalPages ) {
			this.setPageNum( this.totalPages );
		}
	}

	// Virtual properties
	/** A unique identifier of this table type's pager */
	public static readonly identifier: string;
	public get identifier() {
		return ( this.constructor as typeof VueDatatablePager ).identifier;
	}
	/** Reference to the {@link Settings} object linked to this datatable's pager instance. */
	protected static readonly settings: Settings;
	public get settings() {
		return ( this.constructor as typeof VueDatatablePager ).settings;
	}

	public created() {
		// Try to link with table
		if ( !this.linkWithTable( this.table ) ) {
			// If it fail, bind next tables initialization
			const tableReadyHandler = ( tableName: string ) => {
				// If it is the correct table and linking is OK...
				if ( tableName === this.table && this.linkWithTable( tableName ) ) {
					// Unbind table initializations
					this.$root.$off( 'table.ready', tableReadyHandler );
				}
			};
			this.$root.$on( 'table.ready', tableReadyHandler );
		}
	}

	/**
	 * Link the pager with the table, assign to the table some properties, and trigger an event on the table.
	 *
	 * @emits Datatable#table.pager-bound
	 * @param tableName - The name of the table to bind the pager with.
	 * @returns `true` if the link is succesfull, or `false` if it could not find a table to associate with.
	 */
	private linkWithTable( tableName: string ) {
		if ( this.$datatables && this.$datatables[tableName] ) {
			const targetTable = this.$datatables[tableName];
			this.ptableInstance = targetTable;
			targetTable.perPage = this.perPage;
			targetTable.pagers.push( this );
			targetTable.$emit( 'table.pager-bound', this );
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Defines the page index to display.
	 *
	 * @emits change
	 * @param pageIndex - The new page index.
	 * @returns nothing.
	 */
	private setPageNum( pageIndex: number ) {
		this.tableInstance.page = pageIndex;
		this.tableInstance.perPage = this.perPage;

		this.$emit( 'change', pageIndex );
	}
}
