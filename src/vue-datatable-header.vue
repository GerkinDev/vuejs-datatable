<style></style>

<template>
	<th
		:style="{'text-align': column.align}"
		:class="column.headerClass">
		<component
			:is="column.headerComponent"
			v-if="column.headerComponent"
			:column="column" />
		<span v-else>
			{{ column.label }}
		</span>
		<span
			v-if="column.sortable"
			:class="classes"
			@click="toggleSort" />
	</th>
</template>

<script>
export default {
	props: {
		model: {
			prop:  'direction',
			event: 'change',
		},
		column: {
			type:     [ Object, Array ],
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
		classes(){
			const availableClasses = this.settings.get('table.sorting.classes');
			let classes = availableClasses.canSort;

			if (!this.canSort){
				return '';
			}

			if (!this.isSorted){
				classes = classes.concat(availableClasses.sortNone);

				return this.joinClasses(classes);
			}

			if (this.isSortedAscending){
				classes = classes.concat(availableClasses.sortAsc);
			}

			if (this.isSortedDescending){
				classes = classes.concat(availableClasses.sortDesc);
			}

			return this.joinClasses(classes);
		},
	},
	methods: {
		joinClasses(classes){
			return classes.filter((v, i, a) => a.indexOf(v) === i).join(' ');
		},
		toggleSort(){
			if (!this.direction || this.direction === null){
				this.$emit('change', 'asc', this.column);
			} else if (this.direction === 'asc'){
				this.$emit('change', 'desc', this.column);
			} else {
				this.$emit('change', null, this.column);
			}

			return;
		},
	},
};
</script>
