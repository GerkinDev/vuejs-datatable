import { Component, Inject, Prop, Vue } from 'vue-property-decorator';

import { TableType } from '../../../classes';
import { mergeClassVals, namespaceEvent } from './../../../utils';

import template from './vue-datatable-pager-button.html';

/**
 * A control button used by the pager.
 */
@Component( {
	...template,
} )
export class VueDatatablePagerButton extends Vue {
	/**
	 * Defines if the button is triggerable or not.
	 *
	 * @vue-prop
	 */
	@Prop( { type: Boolean, default: false } ) private readonly disabled!: boolean;
	/**
	 * Represents if the pager button is the currently selected one.
	 *
	 * @vue-prop
	 */
	@Prop( { type: Boolean, default: false } ) private readonly selected!: boolean;
	/**
	 * The page index of the button.
	 *
	 * @vue-prop
	 */
	@Prop( { type: Number } ) private readonly value!: number | null;

	/**
	 * The [[TableType]] instance provided through [[ITableTypeConsumer.tableType]].
	 *
	 * @vue Inject `table-type`
	 */
	@Inject( 'table-type' ) private readonly tableType!: TableType<any>;

	/** HTML classes to set on list items tags. */
	public get liClasses() {
		return mergeClassVals(
			this.tableType.setting( 'pager.classes.li' ),
			this.disabled ? this.tableType.setting( 'pager.classes.disabled' ) : undefined,
			this.selected ? this.tableType.setting( 'pager.classes.selected' ) : undefined,
		);
	}

	/** CSS styles to apply on the list items tags */
	public get liStyles() {
		return { cursor: this.disabled ? 'not-allowed' : 'pointer' };
	}

	/**
	 * Emits an event if the button is not [[VueDatatablePagerButton.disabled]].
	 *
	 * @vue-event vuejs-datatable::set-page.
	 * @returns Nothing.
	 */
	public sendClick() {
		if ( !this.disabled ) {
			this.$parent.$emit( namespaceEvent( 'set-page' ), this.value );
		}
	}
}
