import { Component, Prop, Vue } from 'vue-property-decorator';

import { EPagerType, namespaceEvent } from '../../utils';
import { ITableTypeConsumer } from '../mixins/table-type-consumer-factory';
import { VueDatatable } from '../vue-datatable/vue-datatable';
import { TableType } from './../../classes';

import { VueDatatablePagerButton } from './vue-datatable-pager-button/vue-datatable-pager-button';
import template from './vue-datatable-pager.html';

/**
 * The component that is used to manage & change pages on a [[VueDatatable]].
 */
@Component( {
	...template,
	components: {
		PagerButton: VueDatatablePagerButton,
	},
} )
export class VueDatatablePager<TSub extends VueDatatablePager<TSub>> extends Vue implements ITableTypeConsumer {
	/**
	 * The id of the associated [[VueDatatable]].
	 *
	 * @vue-prop
	 */
	@Prop( { type: String, default: 'default' } ) public readonly table!: string;

	/**
	 * The kind of the pager
	 *
	 * @vue-prop
	 */
	@Prop( { type: String, default: EPagerType.Long } ) public readonly type!: EPagerType;

	/**
	 * The number of pages visible on each side (only for [[EPagerType.Abbreviated]])
	 *
	 * @vue-prop
	 */
	@Prop( { type: Number, default: 2 } ) public readonly sidesCount!: number;

	public get sidesIndexes() {
		return [...Array( this.sidesCount ).keys()].map( v => v + 1 );
	}
	private ptableInstance: VueDatatable<any, any> | null = null;
	public get tableInstance(): VueDatatable<any, any> {
		if ( !this.ptableInstance ) {
			throw new ReferenceError( 'Invalid operation: the pager must be attached to a table.' );
		}
		return this.ptableInstance;
	}

	/** Returns `true` if the pager has an associated [[VueDatatable]] with some rows. */
	public get show(): boolean {
		return this.totalRows > 0;
	}
	/** The total number of rows in the associated [[VueDatatable]]. */
	private get totalRows(): number {
		try {
			return this.tableInstance.totalRows;
		} catch {
			return 0;
		}
	}
	/** The total number of pages in the associated [[VueDatatable]]. */
	public totalPages = 0;
	/** The current page index in the associated [[VueDatatable]]. */
	public page = 1;

	/** HTML class on the wrapping `ul` around the pager buttons. */
	public get paginationClass(): string {
		return this.tableType.setting( 'pager.classes.pager' );
	}
	/** HTML content of the previous page's button. */
	public get previousIcon(): string {
		return this.tableType.setting( 'pager.icons.previous' );
	}
	/** HTML content of the next page's button. */
	public get nextIcon(): string {
		return this.tableType.setting( 'pager.icons.next' );
	}

	public readonly tableType!: TableType<any>;
	public get identifier() {
		return this.tableType.id + '-pager';
	}

	/**
	 * Try to link the pager with the table, or bind the `vuejs-datatable::ready` event to watch for new tables addition.
	 */
	public created() {
		// Try to link with table
		if ( !this.linkWithTable( this.table ) ) {
			// If it fail, bind next tables initialization
			const tableReadyHandler = ( tableName: string ) => {
				// If it is the correct table and linking is OK...
				if ( tableName === this.table && this.linkWithTable( tableName ) ) {
					// Unbind table initializations
					this.$root.$off( namespaceEvent( 'ready' ), tableReadyHandler );
				}
			};
			this.$root.$on( namespaceEvent( 'ready' ), tableReadyHandler );
		}
	}

	/**
	 * Link the pager with the table, assign to the table some properties, and trigger an event on the table.
	 *
	 * @vue-event VueDatatable.vuejs-datatable::pager-bound
	 * @vue-event VueDatatable.vuejs-datatable::page-count-changed
	 * @vue-event VueDatatable.vuejs-datatable::page-changed
	 * @param tableName - The name of the table to bind the pager with.
	 * @returns `true` if the link is succesfull, or `false` if it could not find a table to associate with.
	 */
	private linkWithTable( tableName: string ) {
		if ( this.$datatables && this.$datatables[tableName] ) {
			const targetTable = this.$datatables[tableName];
			this.ptableInstance = targetTable;
			targetTable.pagers.push( this );
			// Notify that the pager was bound through the datatable
			targetTable.$emit( namespaceEvent( 'pager-bound' ), this );
			// Bind pagination events
			targetTable.$on( namespaceEvent( 'page-count-changed' ), this.onPageCountChanged );
			targetTable.$on( namespaceEvent( 'page-changed' ), this.onPageChanged );
			this.$on( namespaceEvent( 'set-page' ), this.onSetPage );
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Callback of the `vuejs-datatable::page-count-changed` event, setting the total pages count.
	 *
	 * @param totalPages - The new total pages count emitted by the datatable.
	 */
	private onPageCountChanged( totalPages: number ) {
		this.totalPages = totalPages;
	}

	/**
	 * Callback of the `vuejs-datatable::page-changed` event, setting the page index.
	 *
	 * @param page - The page index emitted by the datatable.
	 */
	private onPageChanged( page: number ) {
		this.page = page;
	}

	/**
	 * Propagate new page from the pager to the datatable.
	 *
	 * @param page - The page index emitted by sub buttons.
	 */
	private onSetPage( page: number ) {
		if ( this.ptableInstance ) {
			this.ptableInstance.page = page;
		}
	}
}
