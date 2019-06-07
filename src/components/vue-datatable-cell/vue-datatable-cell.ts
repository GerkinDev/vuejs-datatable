import { Component, Prop, Vue } from 'vue-property-decorator';

import { Column } from '../../classes/column';

import template from './vue-datatable-cell.html';

/**
 * This component is responsible of the display of a single table cell.
 */
@Component( {
	...template,
} )
export class VueDatatableCell<TRow extends {}> extends Vue {
	/** The column of this cell */
	@Prop( { type: Column, required: true } ) private readonly column!: Column<TRow>;
	/** The row of this cell */
	@Prop( { type: Object, required: true } ) private readonly row!: TRow;

	/**
	 * The representation of the row in the current column.
	 * You can customize the cell content by changing [[IColumnDefinition.field]] or [[IColumnDefinition.representedAs]]
	 */
	public get content(): string {
		return this.column.getRepresentation( this.row );
	}
	/** The styles to apply to this cell */
	public get cellStyles(): {[key: string]: string} {
		return { 'text-align': this.column.align };
	}
}
