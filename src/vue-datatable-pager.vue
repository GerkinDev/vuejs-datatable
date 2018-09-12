<style></style>

<template>
	<nav v-if="show">
		<ul v-if="type === 'abbreviated'" :class="pagination_class">
			<datatable-button v-if="page - 3 >= 1" :value="1" @click="setPageNum"></datatable-button>
			<datatable-button v-if="page - 4 >= 1" disabled>...</datatable-button>

			<datatable-button v-if="page - 2 >= 1" :value="page - 2" @click="setPageNum"></datatable-button>
			<datatable-button v-if="page - 1 >= 1" :value="page - 1" @click="setPageNum"></datatable-button>

			<datatable-button :value="page" selected></datatable-button>

			<datatable-button v-if="page + 1 <= total_pages" :value="page + 1" @click="setPageNum"></datatable-button>
			<datatable-button v-if="page + 2 <= total_pages" :value="page + 2" @click="setPageNum"></datatable-button>

			<datatable-button v-if="page + 4 <= total_pages" disabled>...</datatable-button>
			<datatable-button v-if="page + 3 <= total_pages" :value="total_pages" @click="setPageNum"></datatable-button>
		</ul>
		<ul v-else-if="type === 'long'" :class="pagination_class">
			<datatable-button v-for="i in total_pages" :key="i" :value="i" @click="setPageNum" :selected="i === page"></datatable-button>
		</ul>
		<ul v-else-if="type === 'short'" :class="pagination_class">
			<datatable-button :disabled="page - 1 < 1" :value="page - 1" @click="setPageNum"><span v-html="previous_icon"></span></datatable-button>
			<datatable-button :value="page" selected></datatable-button>
			<datatable-button :disabled="page + 1 > total_pages" :value="page + 1" @click="setPageNum"><span v-html="next_icon"></span></datatable-button>
		</ul>
	</nav>
</template>

<script>
export default {
	model: {
		prop: 'page',
		event: 'change'
	},
	props: {
		table: {
			type: String,
			default: 'default'
		},
		type: {
			type: String,
			default: 'long'
		},
		perPage: {
			type: Number,
			default: 10
		},
		page: {
			type: Number,
			default: 1
		}
	},
	data: () => ({
		table_instance: null,
	}),
	computed: {
		show(){
			return this.table_instance && this.total_rows > 0;
		},
		total_rows(){
			if(this.table_instance){
				return this.table_instance.total_rows;
			}

			return 0;
		},
		pagination_class(){
			return this.settings.get('pager.classes.pager');
		},
		disabled_class(){
			return this.settings.get('pager.classes.disabled');
		},
		previous_link_classes(){
			if(this.page - 1 < 1){
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		next_link_classes(){
			if(this.page + 1 > this.total_pages){
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		total_pages(){
			if(!(this.total_rows > 0)){
				return 0;
			}

			return Math.ceil(this.total_rows / this.perPage);
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
			this.table_instance.page = number;
			this.table_instance.per_page = this.perPage;

			this.$emit('change', number);
		},
		getClassForPage(number){
			if(this.page == number){
				return this.settings.get('pager.classes.selected');
			}

			return '';
		}
	},
	watch: {
		total_rows(){
			if(this.page > this.total_pages){
				this.setPageNum(this.total_pages);
			}
		},
		perPage(){
			var page = this.page;

			if(page > this.total_pages){
				page = this.total_pages
			}

			this.setPageNum(page);
		}
	},
	created(){
		if(this.$datatables[this.table]){
			this.table_instance = this.$datatables[this.table];
			this.table_instance.per_page = this.perPage;
			return;
		}

		this.$root.$on('table.ready', function(table_name){
			if(table_name === this.table){
				this.table_instance = this.$datatables[this.table];
				this.table_instance.per_page = this.perPage;
			}
		}.bind(this));
	},
	settings: null
}
</script>
