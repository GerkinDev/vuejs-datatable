<style></style>

<template>
	<nav v-if="show">
		<ul v-if="type === 'abbreviated'" :class="pagination_class">
			<datatable-button v-if="value - 3 >= 1" :value="1" @click="setPageNum"></datatable-button>
			<datatable-button v-if="value - 4 >= 1" disabled>...</datatable-button>

			<datatable-button v-if="value - 2 >= 1" :value="value - 2" @click="setPageNum"></datatable-button>
			<datatable-button v-if="value - 1 >= 1" :value="value - 1" @click="setPageNum"></datatable-button>

			<datatable-button :value="value" selected></datatable-button>

			<datatable-button v-if="value + 1 <= total_pages" :value="value + 1" @click="setPageNum"></datatable-button>
			<datatable-button v-if="value + 2 <= total_pages" :value="value + 2" @click="setPageNum"></datatable-button>

			<datatable-button v-if="value + 4 <= total_pages" disabled>...</datatable-button>
			<datatable-button v-if="value + 3 <= total_pages" :value="total_pages" @click="setPageNum"></datatable-button>
		</ul>
		<ul v-else-if="type === 'long'" :class="pagination_class">
			<datatable-button v-for="i in total_pages" :value="i" @click="setPageNum" :selected="i === value"></datatable-button>
		</ul>
		<ul v-else-if="type === 'short'" :class="pagination_class">
			<datatable-button :disabled="value - 1 < 1" :value="value - 1" @click="setPageNum"><span v-html="previous_icon"></span></datatable-button>
			<datatable-button :value="value"></datatable-button>
			<datatable-button :disabled="value + 1 > total_pages" :value="value + 1" @click="setPageNum"><span v-html="next_icon"></span></datatable-button>
		</ul>
	</nav>
</template>

<script>
export default {
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: Number,
			default: 1
		},
		perPage: {
			type: Number,
			default: null
		},
		totalRows: {
			type: Number,
			default: 0
		},
		type: {
			type: String,
			default: 'long'
		}
	},
	computed: {
		show(){
			return this.totalRows > 0;
		},
		pagination_class(){
			return this.settings.get('pager.classes.pager');
		},
		disabled_class(){
			return this.settings.get('pager.classes.disabled');
		},
		previous_link_classes(){
			if(this.value - 1 < 1){
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		next_link_classes(){
			if(this.value + 1 > this.total_pages){
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		total_pages(){
			if(!(this.totalRows > 0)){
				return 0;
			}

			return Math.ceil(this.totalRows / this.perPage);
		},
		previous_icon(){
			return this.settings.get('pager.icons.previous');
		},
		next_icon(){
			return this.settings.get('pager.icons.next');
		},
		settings(){
			return this.$options.settings;
		},
	},
	methods: {
		setPageNum(number){
			this.$emit('change', number);
		},
		getClassForPage(number){
			if(this.value == number){
				return this.settings.get('pager.classes.selected');
			}

			return '';
		}
	},
	watch: {
		totalRows(){
			if(this.value > this.total_pages){
				this.setPageNum(this.total_pages);
			}
		}
	},
	settings: null
}
</script>
