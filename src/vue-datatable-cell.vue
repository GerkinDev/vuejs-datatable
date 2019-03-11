<template>
	<td
		v-if="column.component"
		:style="cellStyles">
		<component
			:is="column.component"
			v-if="column.component"
			:row="row"
			:column="column" />
	</td>
	<td
		v-else-if="column.interpolate"
		:style="cellStyles"
		v-html="content" />
	<td
		v-else
		:style="cellStyles">
		{{ content }}
	</td>
</template>

<script>
/**
 * @module datatable-cell
 * 
 * @vue-prop {Column} column - The column of the cell
 * @vue-prop {Row} row       - The row object of the cell
 * 
 * @vue-computed {string} content - The string content of the cell. It may be interpolated to HTML if {@link Column#interpolate} is `true`.
 */
export default {
	props: {
		column: {
			type:     Object,
			required: true,
		},
		row: {
			type:     Object,
			required: true,
		},
	},
	computed: {
		content(){
			return this.column.getRepresentation( this.row );
		},
		cellStyles(){
			return { 'text-align': this.column.align };
		},
	},
};
</script>
