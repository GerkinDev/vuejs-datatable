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
				v-if="page > 1"
				:value="page - 1"
				@click="setPageNum">
				<span v-html="previousIcon" />
			</datatable-button>
			<datatable-button
				:value="page"
				selected />
			<datatable-button
				v-if="page < totalPages"
				:value="page + 1"
				@click="setPageNum">
				<span v-html="nextIcon" />
			</datatable-button>
		</ul>
	</nav>
</template>

<script>
/**
 * The component that is used to manage & change pages on a {@link datatable}.
 * 
 * @module datatable-pager
 * 
 * @vue-prop {string} [table = 'default'] - The id of the associated {@link datatable}.
 * @vue-prop {'long' | 'short' | 'abbreviated'} [type = 'long'] - The kind of the pager
 * @vue-prop {number} [perPage = 10] - Max number of items to display.
 * @vue-prop {number} [page = 1] - The page index to display
 * 
 * @vue-data {datatable | null} tableInstance - Reference to the associated {@link datatable} through the {@link datatable-pager#table} prop.
 * 
 * @vue-computed {boolean} show - Returns `true` if the pager has an associated {@link datatable} with some rows.
 * @vue-computed {number} totalRows - The total number of rows in the associated {@link datatable}.
 * @vue-computed {string} paginationClass - HTML class on the wrapping `ul` around the pager buttons.
 * @vue-computed {string} disabledClass - HTML class to apply on disabled buttons. (unused).
 * @vue-computed {string} previousLinkClasses - HTML class to apply on the previous page's button. (unused).
 * @vue-computed {string} nextLinkClasses - HTML class to apply on the next page's button. (unused).
 * @vue-computed {number} totalPages - The total number of pages in the associated {@link datatable}.
 * @vue-computed {string} previousIcon - HTML content of the previous page's button.
 * @vue-computed {string} nextIcon - HTML content of the next page's button.
 * @vue-computed {Settings} settings - Reference to the {@link Settings} object linked to this pager type.
 */
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
	data: () => ( {
		tableInstance: null,
	} ),
	computed: {
		show(){
			return this.tableInstance && this.totalRows > 0;
		},
		totalRows(){
			if ( this.tableInstance ){
				return this.tableInstance.totalRows;
			}

			return 0;
		},
		paginationClass(){
			return this.settings.get( 'pager.classes.pager' );
		},
		totalPages(){
			if ( this.totalRows <= 0 || this.perPage <= 0 ){
				return null;
			}

			return Math.ceil( this.totalRows / this.perPage );
		},
		previousIcon(){
			return this.settings.get( 'pager.icons.previous' );
		},
		nextIcon(){
			return this.settings.get( 'pager.icons.next' );
		},
		settings(){
			return this.$options.settings;
		},
	},
	watch: {
		totalRows(){
			if ( this.page > this.totalPages ){
				this.setPageNum( this.totalPages );
			}
		},
		perPage(){
			// Skip change if no need to change page
			if ( this.page <= this.totalPages ){
				return;
			}

			this.setPageNum( this.totalPages );
		},
	},
	created(){
		if ( this.$datatables && this.$datatables[this.table] ){
			this.tableInstance = this.$datatables[this.table];
			this.tableInstance.perPage = this.perPage;
			return;
		}

		this.$root.$on( 'table.ready', tableName => {
			if ( tableName === this.table ){
				this.tableInstance = this.$datatables[this.table];
				this.tableInstance.perPage = this.perPage;
			}
		} );
	},
	methods: {
		/**
		 * Defines the page index to display.
		 *
		 * @emits change
		 * @param {number} pageIndex - The new page index.
		 * @returns {void} Nothing.
		 */
		setPageNum( pageIndex ){
			this.tableInstance.page = pageIndex;
			this.tableInstance.perPage = this.perPage;

			this.$emit( 'change', pageIndex );
		},
	},
	settings: null,
};
</script>
