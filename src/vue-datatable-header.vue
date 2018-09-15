<style></style>

<template>
	<th :style="{'text-align': column.align}" :class="column.headerClass">
        <component v-if="column.headerComponent" :is="column.headerComponent" :column="column"></component>
        <span v-else>{{ column.label  }}</span>
		<span
			v-if="column.sortable"
			:class="classes"
			@click="toggleSort"
		></span>
	</th>
</template>

<script>
export default {
	props: {
		model: {
			prop: 'direction',
			event: 'change'
		},
		column: [Object, Array],
		settings: Object,
		direction: {
			type: String,
			default: null
		}
	},
	computed: {
		canSort(){
			return this.column.sortable;
		},
		is_sorted_ascending(){
			return this.direction === 'asc';
		},
		is_sorted_descending(){
			return this.direction === 'desc';
		},
		is_sorted(){
			return this.is_sorted_descending || this.is_sorted_ascending;
		},
		classes(){
			var available_classes = this.settings.get('table.sorting.classes');
			var classes = available_classes.canSort;

			if(!this.canSort){
				return '';
			}

			if(!this.is_sorted){
				classes = classes.concat(available_classes.sortNone);

				return this.joinClasses(classes);
			}

			if(this.is_sorted_ascending){
				classes = classes.concat(available_classes.sortAsc);
			}

			if(this.is_sorted_descending){
				classes = classes.concat(available_classes.sortDesc);
			}

			return this.joinClasses(classes);
		}
	},
	methods: {
		joinClasses(classes){
			return this.unique(classes).join(' ');
		},
		toggleSort(){
			if(!this.direction || this.direction === null){
				this.$emit('change', 'asc', this.column);
			}else if(this.direction === 'asc'){
				this.$emit('change', 'desc', this.column);
			}else{
				this.$emit('change', null, this.column);
			}

			return;
		},
		unique(ar) {
		    var seen = {};

		    return ar.filter(function(item) {
		        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		    });
		}
	},
}
</script>
