import { Vue } from 'vue-property-decorator';
/**
 * This component is responsible of the display of a single table cell.
 */
export declare class VueDatatableCell<TRow extends {}> extends Vue {
    /** The column of this cell */
    private readonly column;
    /** The row of this cell */
    private readonly row;
    /**
     * The representation of the row in the current column.
     * You can customize the cell content by changing [[IColumnDefinition.field]] or [[IColumnDefinition.representedAs]]
     */
    readonly content: string;
    /** The styles to apply to this cell */
    readonly cellStyles: {
        [key: string]: string;
    };
}
