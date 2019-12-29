import { Vue } from 'vue-property-decorator';
/**
 * A control button used by the pager.
 */
export declare class VueDatatableHeader<TRow extends {}> extends Vue {
    /**
     * The current sort direction for the current column.
     *
     * @vue-model
     */
    private readonly direction;
    /**
     * The [[Column]] instance this header is for.
     *
     * @vue-prop
     */
    private readonly column;
    /**
     * The [[TableType]] instance provided through [[TableTypeConsumer.tableType]].
     *
     * @vue Inject `table-type`
     */
    private readonly tableType;
    /** `true` if this column is sortable. */
    private get canSort();
    /** `true` if this column is sorted in *ascending* mode. */
    private get isSortedAscending();
    /** `true` if this column is sorted in *descending* mode. */
    private get isSortedDescending();
    /** Get the HTML content of the header's sort icon */
    get sortButtonHtml(): string;
    /**
     * Toggles the sort order, looping between states `null => 'asc' => 'desc'`.
     *
     * @vue-event change Emitted when the sort direction or column is changed.
     * @vue-event-param change newDirection <ESortDir | null> - The new direction.
     * @vue-event-param change sortedColumn <Column> - The column the sort is done on.
     * @returns nothing.
     */
    toggleSort(): void;
}
