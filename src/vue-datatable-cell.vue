<style></style>

<template>
	<td :style="{'text-align': column.align}">
		 <component v-if="column.component" :is="column.component" :row="row" :column="column"></component>
		 <span v-else-if="column.interpolate" v-html="content"></span>
		 <span v-else>{{ content }}</span>
	</td>
</template>

<script>
export default {
	props: {
		column: [Object, Array],
		row: [Object, Array]
	},
	computed: {
		content(){
			return this.column.getRepresentation(this.row);
		}
	},
}
</script>
