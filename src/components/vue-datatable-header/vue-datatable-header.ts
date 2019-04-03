import { Component, Model, Prop, Vue } from 'vue-property-decorator';

import { Column } from '../../classes/column';
import { ESortDir } from '../../classes/handlers';
import { Settings } from '../../classes/settings';

import template from './vue-datatable-header.html';

/**
 * A control button used by the pager.
 */
@Component( {
	...template,
} )
export class VueDatatableHeader<TRow extends {}> extends Vue {
	/** The current sort direction for the current column. */
	@Model( 'change', { type: String } ) private readonly direction!: ESortDir | null;

	/** The {@link Column} instance this header is for. */
	@Prop( { type: Object, required: true } ) private readonly column!: Column<TRow>;
	/** The {@link Settings} instance associated with this {@link VueDatatable}'s header. */
	@Prop( { type: Object, required: true } ) private readonly settings!: Settings;

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
	/** `true` if this column is sorted, in any mode. */
	private get isSorted(): boolean {
		return this.isSortedAscending || this.isSortedDescending;
	}
	/** Get the HTML content of the header's sort icon */
	private get sortButtonHtml(): string {
		const htmlContents = this.settings.get( 'table.sorting' );

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
	 * @emits change
	 * @returns nothing.
	 */
	private toggleSort(): void {
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
