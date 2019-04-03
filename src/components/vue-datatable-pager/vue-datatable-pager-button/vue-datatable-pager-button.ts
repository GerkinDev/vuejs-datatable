import { Component, Prop, Vue } from 'vue-property-decorator';

import { Settings } from '../../../classes';
import { VueDatatablePager } from '../vue-datatable-pager';

import template from './vue-datatable-pager-button.html';

/**
 * A control button used by the pager.
 */
@Component( {
	...template,
} )
export class VueDatatablePagerButton extends Vue {
	/** Defines if the button is triggerable or not. */
	@Prop( { type: Boolean, default: false } ) private readonly disabled!: boolean;
	/** Represents if the pager button is the currently selected one. */
	@Prop( { type: Boolean, default: false } ) private readonly selected!: boolean;
	/** The page index of the button. */
	@Prop( { type: Number } ) private readonly value!: number | null;

	/** HTML classes to set on list items tags. */
	private get liClasses() {
		const classes = [ this.settings.get( 'pager.classes.li' ) ];

		if ( this.disabled ) {
			classes.push( this.settings.get( 'pager.classes.disabled' ) );
		}

		if ( this.selected ) {
			classes.push( this.settings.get( 'pager.classes.selected' ) );
		}

		return classes.filter( v => !!v ).join( ' ' );
	}
	/** CSS styles to apply on the list items tags */
	private get liStyles() {
		return { cursor: this.disabled ? 'not-allowed' : 'pointer' };
	}
	/** Reference to the {@link Settings} object linked to the parent pager. */
	private get settings(): Settings {
		return ( this.$parent as VueDatatablePager<any> ).settings;
	}

	/**
	 * Emits an event if the button is not {@link datatable-pager-button#disabled}.
	 *
	 * @emits click.
	 * @returns {void} Nothing.
	 */
	private sendClick() {
		if ( !this.disabled ) {
			this.$emit( 'click', this.value );
		}
	}
}
