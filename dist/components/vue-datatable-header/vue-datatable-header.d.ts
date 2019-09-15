import { Vue } from 'vue-property-decorator';
/**
 * A control button used by the pager.
 */
export declare class VueDatatableHeader<TRow extends {}> extends Vue {
    /**
     * The current sort direction for the current column.
     *
     * @vue Model
     */
    private readonly direction;
    /**
     * The [[Column]] instance this header is for.
     *
     * @vue Prop
     */
    private readonly column;
    /**
     * The [[TableType]] instance provided through [[TableTypeConsumer.tableType]].
     *
     * @vue Inject `table-type`
     */
    private readonly tableType;
    /** `true` if this column is sortable. */
    private readonly canSort;
    /** `true` if this column is sorted in *ascending* mode. */
    private readonly isSortedAscending;
    /** `true` if this column is sorted in *descending* mode. */
    private readonly isSortedDescending;
    /** Get the HTML content of the header's sort icon */
    readonly sortButtonHtml: string;
    /**
     * Toggles the sort order, looping between states `null => 'asc' => 'desc'`.
     *
     * @emits change
     * @returns nothing.
     */
    toggleSort(): void;
}
