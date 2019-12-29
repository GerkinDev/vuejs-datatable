import { Vue } from 'vue-property-decorator';
import { EPagerType } from '../../utils';
import { VueDatatable } from '../vue-datatable/vue-datatable';
import { TableType } from './../../classes';
/**
 * The component that is used to manage & change pages on a [[VueDatatable]].
 */
export declare class VueDatatablePager<TSub extends VueDatatablePager<TSub>> extends Vue {
    /**
     * The id of the associated [[VueDatatable]].
     *
     * @vue-prop
     */
    readonly table: string;
    /**
     * The kind of the pager
     *
     * @vue-prop
     */
    readonly type: EPagerType;
    /**
     * The number of pages visible on each side (only for [[EPageType.Abbreviated]])
     *
     * @vue-prop
     */
    readonly sidesCount: number;
    get sidesIndexes(): number[];
    private ptableInstance;
    get tableInstance(): VueDatatable<any, any>;
    /** Returns `true` if the pager has an associated [[VueDatatable]] with some rows. */
    get show(): boolean;
    /** The total number of rows in the associated [[VueDatatable]]. */
    private get totalRows();
    /** The total number of pages in the associated [[VueDatatable]]. */
    totalPages: number;
    /** The current page index in the associated [[VueDatatable]]. */
    page: number;
    /** HTML class on the wrapping `ul` around the pager buttons. */
    get paginationClass(): string;
    /** HTML content of the previous page's button. */
    get previousIcon(): string;
    /** HTML content of the next page's button. */
    get nextIcon(): string;
    protected readonly tableType: TableType<any>;
    get identifier(): string;
    /**
     * Try to link the pager with the table, or bind the `vuejs-datatable::ready` event to watch for new tables addition.
     */
    created(): void;
    /**
     * Link the pager with the table, assign to the table some properties, and trigger an event on the table.
     *
     * @vue-event VueDatatable.vuejs-datatable::pager-bound
     * @vue-event VueDatatable.vuejs-datatable::page-count-changed
     * @vue-event VueDatatable.vuejs-datatable::page-changed
     * @param tableName - The name of the table to bind the pager with.
     * @returns `true` if the link is succesfull, or `false` if it could not find a table to associate with.
     */
    private linkWithTable;
    /**
     * Callback of the `vuejs-datatable::page-count-changed` event, setting the total pages count.
     *
     * @param totalPages - The new total pages count emitted by the datatable.
     */
    private onPageCountChanged;
    /**
     * Callback of the `vuejs-datatable::page-changed` event, setting the page index.
     *
     * @param page - The page index emitted by the datatable.
     */
    private onPageChanged;
    /**
     * Propagate new page from the pager to the datatable.
     *
     * @param page - The page index emitted by sub buttons.
     */
    private onSetPage;
}
