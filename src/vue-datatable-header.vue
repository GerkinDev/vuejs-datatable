<template>
	<th
		:style="{'text-align': column.headerAlign, cursor: canSort ? 'pointer' : 'auto'}"
		:class="column.headerClass"
		@click="toggleSort">
		<component
			:is="column.headerComponent"
			v-if="column.headerComponent"
			:column="column" />
		<span v-else>
			{{ column.label }}
		</span>
		<span
			v-if="canSort"
			v-html="sortButtonHtml" />
	</th>
</template>

<script>
/**
 * A control button used by the pager.
 * 
 * @module datatable-pager-button
 * 
 * @vue-prop {Column} column - The {@link Column} instance this header is for.
 * @vue-prop {Settings} settings - The {@link Settings} instance associated with this {@link datatable}'s header.
 * @vue-prop {'asc' | 'desc' | null} [direction = null] - The current sort direction for the current column.
 * 
 * @vue-computed {boolean} canSort - `true` if this column is sortable.
 * @vue-computed {boolean} isSortedAscending - `true` if this column is sorted in *ascending* mode.
 * @vue-computed {boolean} isSortedDescending -`true` if this column is sorted in *descending* mode.
 * @vue-computed {boolean} isSorted - `true` if this column is sorted, in any mode.
 * @vue-computed {string} classes - HTML classes to apply on this header.
 */
export default {
	model: {
		prop:  'direction',
		event: 'change',
	},
	props: {
		column: {
			type:     Object,
			required: true,
		},
		settings: {
			type:     Object,
			required: true,
		},
		direction: {
			type:    String,
			default: null,
		},
	},
	computed: {
		canSort(){
			return this.column.sortable;
		},
		isSortedAscending(){
			return this.direction === 'asc';
		},
		isSortedDescending(){
			return this.direction === 'desc';
		},
		isSorted(){
			return this.isSortedAscending || this.isSortedDescending;
		},
		sortButtonHtml(){
			const htmlContents = this.settings.get('table.sorting');

			if (this.isSortedAscending){
				return htmlContents.sortAsc;
			} else if (this.isSortedDescending){
				return htmlContents.sortDesc;
			} else {
				return htmlContents.sortNone;
			}
		},
	},
	methods: {
		/**
		 * Toggles the sort order, looping between states `null => 'asc' => 'desc'`.
		 * 
		 * @emits change
		 * @returns {void} Nothing.
		 */
		toggleSort(){
			if (!this.canSort){
				return;
			}
			if (!this.direction || this.direction === null){
				this.$emit('change', 'asc', this.column);
			} else if (this.direction === 'asc'){
				this.$emit('change', 'desc', this.column);
			} else {
				this.$emit('change', null, this.column);
			}
		},
	},
};
</script>
