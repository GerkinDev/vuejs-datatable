import { Vue } from 'vue-property-decorator';
/**
 * A control button used by the pager.
 */
export declare class VueDatatablePagerButton extends Vue {
    /**
     * Defines if the button is triggerable or not.
     *
     * @vue Prop
     */
    private readonly disabled;
    /**
     * Represents if the pager button is the currently selected one.
     *
     * @vue Prop
     */
    private readonly selected;
    /**
     * The page index of the button.
     *
     * @vue Prop
     */
    private readonly value;
    /**
     * The [[TableType]] instance provided through [[TableTypeConsumer.tableType]].
     *
     * @vue Inject `table-type`
     */
    private readonly tableType;
    /** HTML classes to set on list items tags. */
    readonly liClasses: string[];
    /** CSS styles to apply on the list items tags */
    readonly liStyles: {
        cursor: string;
    };
    /**
     * Emits an event if the button is not [[VueDatatablePagerButton.disabled]].
     *
     * @emits vuejs-datatable::set-page.
     * @returns Nothing.
     */
    sendClick(): void;
}
