import { Vue } from 'vue-property-decorator';
/**
 * A control button used by the pager.
 */
export declare class VueDatatablePagerButton extends Vue {
    /**
     * Defines if the button is triggerable or not.
     *
     * @vue-prop
     */
    private readonly disabled;
    /**
     * Represents if the pager button is the currently selected one.
     *
     * @vue-prop
     */
    private readonly selected;
    /**
     * The page index of the button.
     *
     * @vue-prop
     */
    private readonly value;
    /**
     * The [[TableType]] instance provided through [[TableTypeConsumer.tableType]].
     *
     * @vue Inject `table-type`
     */
    private readonly tableType;
    /** HTML classes to set on list items tags. */
    get liClasses(): string[];
    /** CSS styles to apply on the list items tags */
    get liStyles(): {
        cursor: string;
    };
    /**
     * Emits an event if the button is not [[VueDatatablePagerButton.disabled]].
     *
     * @vue-event vuejs-datatable::set-page.
     * @returns Nothing.
     */
    sendClick(): void;
}
