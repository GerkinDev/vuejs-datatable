<template>
	<td :style="{'text-align': column.align}">
		<component
			:is="column.component"
			v-if="column.component"
			:row="row"
			:column="column" />
		<template
			v-else-if="column.interpolate"
			v-html="content"></template>
		<template v-else>
			{{ content }}
		</template>
	</td>
</template>

<script>
/**
 * @module datatable-cell
 * 
 * @vue-prop {Column} column - The column of the cell
 * @vue-prop {Row} row - The row object of the cell
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
			return this.column.getRepresentation(this.row);
		},
	},
};
</script>
