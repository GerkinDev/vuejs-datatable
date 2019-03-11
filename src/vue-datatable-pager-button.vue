<template>
	<li 
		:style="{cursor: disabled ? 'not-allowed' : 'pointer'}"
		:class="liClasses"
		@click="sendClick">
		<slot>{{ value }}</slot>
	</li>
</template>

<script>
/**
 * A control button used by the pager.
 * 
 * @module datatable-pager-button
 * 
 * @vue-prop {boolean} [disabled = false] - Defines if the button is triggerable or not.
 * @vue-prop {boolean} [selected = false] - Represents if the pager button is the currently selected one.
 * @vue-prop {number} value               - The page index of the button.
 * 
 * @vue-computed {string} aClasses   - HTML classes to set on link tags.
 * @vue-computed {string} liClasses  - HTML classes to set on list items tags.
 * @vue-computed {Settings} settings - Reference to the {@link Settings} object linked to the parent pager.
 */
export default {
	props: {
		disabled: {
			type:    Boolean,
			default: false,
		},
		selected: {
			type:    Boolean,
			default: false,
		},
		value: {
			type:     Number,
			required: false,
			default:  null,
		},
	},
	computed: {
		liClasses(){
			const classes = [ this.settings.get( 'pager.classes.li' ) ];

			if ( this.disabled ){
				classes.push( this.settings.get( 'pager.classes.disabled' ) );
			}

			if ( this.selected ){
				classes.push( this.settings.get( 'pager.classes.selected' ) );
			}

			return classes.filter( v => !!v ).join( ' ' );
		},
		settings(){
			return this.$parent.settings;
		},
	},
	methods: {
		/**
		 * Emits an event if the button is not {@link datatable-pager-button#disabled}.
		 * 
		 * @emits click.
		 * @returns {void} Nothing.
		 */
		sendClick(){
			if ( !this.disabled ){
				this.$emit( 'click', this.value );
			}
		},
	},
};
</script>
