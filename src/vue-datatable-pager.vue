<style></style>

<template>
	<nav v-if="show">
		<ul
			v-if="type === 'abbreviated'"
			:class="paginationClass">
			<datatable-button
				v-if="page - 3 >= 1"
				:value="1"
				@click="setPageNum" />
			<datatable-button
				v-if="page - 4 >= 1"
				disabled>
				...
			</datatable-button>

			<datatable-button
				v-if="page - 2 >= 1"
				:value="page - 2"
				@click="setPageNum" />
			<datatable-button
				v-if="page - 1 >= 1"
				:value="page - 1"
				@click="setPageNum" />

			<datatable-button
				:value="page"
				selected />

			<datatable-button
				v-if="page + 1 <= totalPages"
				:value="page + 1"
				@click="setPageNum" />
			<datatable-button
				v-if="page + 2 <= totalPages"
				:value="page + 2"
				@click="setPageNum" />

			<datatable-button
				v-if="page + 4 <= totalPages"
				disabled>
				...
			</datatable-button>
			<datatable-button
				v-if="page + 3 <= totalPages"
				:value="totalPages"
				@click="setPageNum" />
		</ul>
		<ul
			v-else-if="type === 'long'"
			:class="paginationClass">
			<datatable-button
				v-for="i in totalPages"
				:key="i"
				:value="i"
				:selected="i === page"
				@click="setPageNum" />
		</ul>
		<ul
			v-else-if="type === 'short'"
			:class="paginationClass">
			<datatable-button
				:disabled="page - 1 < 1"
				:value="page - 1"
				@click="setPageNum">
				<span v-html="previousIcon" />
			</datatable-button>
			<datatable-button
				:value="page"
				selected />
			<datatable-button
				:disabled="page + 1 > totalPages"
				:value="page + 1"
				@click="setPageNum">
				<span v-html="nextIcon" />
			</datatable-button>
		</ul>
	</nav>
</template>

<script>
export default {
	model: {
		prop:  'page',
		event: 'change',
	},
	props: {
		table: {
			type:    String,
			default: 'default',
		},
		type: {
			type:    String,
			default: 'long',
		},
		perPage: {
			type:    Number,
			default: 10,
		},
		page: {
			type:    Number,
			default: 1,
		},
	},
	data: () => ({
		tableInstance: null,
	}),
	computed: {
		show(){
			return this.tableInstance && this.totalRows > 0;
		},
		totalRows(){
			if (this.tableInstance){
				return this.tableInstance.totalRows;
			}

			return 0;
		},
		paginationClass(){
			return this.settings.get('pager.classes.pager');
		},
		disabledClass(){
			return this.settings.get('pager.classes.disabled');
		},
		previousLinkClasses(){
			if (this.page - 1 < 1){
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		nextLinkClasses(){
			if (this.page + 1 > this.totalPages){
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		totalPages(){
			if (!(this.totalRows > 0)){
				return 0;
			}

			return Math.ceil(this.totalRows / this.perPage);
		},
		previousIcon(){
			return this.settings.get('pager.icons.previous');
		},
		nextIcon(){
			return this.settings.get('pager.icons.next');
		},
		settings(){
			return this.$options.settings;
		},
	},
	watch: {
		totalRows(){
			if (this.page > this.totalPages){
				this.setPageNum(this.totalPages);
			}
		},
		perPage(){
			let page = this.page;

			if (page > this.totalPages){
				page = this.totalPages;
			}

			this.setPageNum(page);
		},
	},
	created(){
		if (this.$datatables[this.table]){
			this.tableInstance = this.$datatables[this.table];
			this.tableInstance.perPage = this.perPage;
			return;
		}

		this.$root.$on('table.ready', tableName => {
			if (tableName === this.table){
				this.tableInstance = this.$datatables[this.table];
				this.tableInstance.perPage = this.perPage;
			}
		});
	},
	methods: {
		setPageNum(number){
			this.tableInstance.page = number;
			this.tableInstance.perPage = this.perPage;

			this.$emit('change', number);
		},
		getClassForPage(number){
			if (this.page === number){
				return this.settings.get('pager.classes.selected');
			}

			return '';
		},
	},
	settings: null,
};
</script>
