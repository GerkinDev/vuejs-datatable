import { Component, Inject, Model, Prop, Vue } from 'vue-property-decorator';

import { Column, ESortDir, TableType } from '../../classes';

import template from './vue-datatable-header.html';

/**
 * A control button used by the pager.
 */
@Component( {
	...template,
} )
export class VueDatatableHeader<TRow extends {}> extends Vue {
	/**
	 * The current sort direction for the current column.
	 *
	 * @vue-model
	 */
	@Model( 'change', { type: String } ) private readonly direction!: ESortDir | null;

	/**
	 * The [[Column]] instance this header is for.
	 *
	 * @vue-prop
	 */
	@Prop( { type: Object, required: true } ) private readonly column!: Column<TRow>;

	/**
	 * The [[TableType]] instance provided through [[ITableTypeConsumer.tableType]].
	 *
	 * @vue Inject `table-type`
	 */
	@Inject( 'table-type' ) private readonly tableType!: TableType<any>;

	/** `true` if this column is sortable. */
	private get canSort(): boolean {
		return this.column.sortable;
	}

	/** `true` if this column is sorted in *ascending* mode. */
	private get isSortedAscending(): boolean {
		return this.direction === ESortDir.Asc;
	}

	/** `true` if this column is sorted in *descending* mode. */
	private get isSortedDescending(): boolean {
		return this.direction === ESortDir.Desc;
	}

	/** Get the HTML content of the header's sort icon */
	public get sortButtonHtml(): string {
		const htmlContents = this.tableType.setting( 'table.sorting' );

		if ( this.isSortedAscending ) {
			return htmlContents.sortAsc;
		} else if ( this.isSortedDescending ) {
			return htmlContents.sortDesc;
		} else {
			return htmlContents.sortNone;
		}
	}

	/**
	 * Toggles the sort order, looping between states `null => 'asc' => 'desc'`.
	 *
	 * @vue-event change Emitted when the sort direction or column is changed.
	 * @vue-event-param change newDirection <ESortDir | null> - The new direction.
	 * @vue-event-param change sortedColumn <Column> - The column the sort is done on.
	 * @returns nothing.
	 */
	public toggleSort(): void {
		if ( !this.canSort ) {
			return;
		}
		if ( !this.direction || this.direction === null ) {
			this.$emit( 'change', ESortDir.Asc, this.column );
		} else if ( this.direction === ESortDir.Asc ) {
			this.$emit( 'change', ESortDir.Desc, this.column );
		} else {
			this.$emit( 'change', null, this.column );
		}
	}
}
