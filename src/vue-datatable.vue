<style scoped>
	table th .sort {
		cursor: pointer;
	}

	.table-above, .table-below {
		padding: 0px 15px;
	}
</style>

<template>
	<div class="row">
		<div class="col-xs-12">

			<div class="table-above row form-inline">
				<div class="col-xs-12">
					<div v-if="filterable" class="form-group">
						<label for="filter" class="sr-only">Filter</label>
						<input type="text" id="filter" class="form-control" v-model="store.filter" placeholder="Filter">
					</div>
				</div>
			</div>

			<table class="table table-hover table-striped">
				<thead>
					<tr>
						<th v-for="head_column in column_props" :style="{'text-align': head_column.align}">
							{{ head_column.label }}
							<span
								v-if="head_column.sortable"
								:class="getHeaderColumnClass(head_column)"
								@click="store.sortBy(head_column.id)"
							></span>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in store.visible_rows">
						<td v-for="row_column in column_props" :style="{'text-align': row_column.align}">
							<span v-if="row_column.field">{{ row[row_column.field] }}</span>
							<span v-if="row_column.callback">{{ row_column.callback(row) }}</span>
							<component v-if="row_column.component" :is="row_column.component" :row="row"></component>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="table-below row form-inline">
				<div class="col-xs-12">

					<div v-if="paginate" class="form-group">
						<label for="filter">Page Size</label>
						<select v-model="store.page_size" class="form-control" @change.stop="">
							<option v-for="size in size_options" :value="size">{{ size }}</option>
						</select>
					</div>

					<span v-if="paginate" class="btn-group">
						<button class="btn btn-default" v-if="store.page - 3 >= 1" @click="store.setPage(1, $event)">1</button>
						<button class="btn btn-default" v-if="store.page - 4 >= 1" disabled>...</button>


						<button class="btn btn-default" v-if="store.page - 2 >= 1" @click="store.setPage(store.page - 2, $event)">{{ store.page - 2 }}</button>
						<button class="btn btn-default" v-if="store.page - 1 >= 1" @click="store.setPage(store.page - 1, $event)">{{ store.page - 1 }}</button>


						<button class="btn btn-default active">{{ store.page }}</button>


						<button class="btn btn-default" v-if="store.page + 1 <= store.last_page" @click="store.setPage(store.page + 1, $event)">{{ store.page + 1 }}</button>
						<button class="btn btn-default" v-if="store.page + 2 <= store.last_page" @click="store.setPage(store.page + 2, $event)">{{ store.page + 2 }}</button>


						<button class="btn btn-default" v-if="store.page + 4 <= store.last_page" disabled>...</button>
						<button class="btn btn-default" v-if="store.page + 3 <= store.last_page" @click="store.setPage(store.last_page, $event)">{{ store.last_page }}</button>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import json_store from './stores/json.js';

export default {
	props: {
		columns: [Object, Array],
		data: [Object, Array, String],
		filterable: {
			type: Boolean,
			default: false
		},
		paginate: {
			type: Boolean,
			default: false
		},
		size_options: {
			type: [Object, Array],
			default: function(){return [10, 25, 50, 100]; }
		}
	},
	data: () => ({
		store: null
	}),
	computed: {
		column_props: function(){
			var i = 0;
			return this.columns.map(function(column){
				var sortable = typeof column.sortable === 'undefined' ? true : column.sortable;
				sortable = column.component ? false : sortable;
				
				var filterable = typeof column.filterable === 'undefined' ? true : column.filterable;
				filterable = column.component ? false : filterable;

				return {
					id: i++,
					label: column.label || '',
					align: column.align || 'left',
					sortable: sortable,
					filterable: filterable,
					field: column.field || null,
					callback: column.callback || null,
					component: column.component || null
				};
			});
		}
	},
	methods: {
		getHeaderColumnClass(head_column){
			const sort_none =
				head_column.id !== this.store.sort_by || !this.store.sort_dir;

			const sort_asc =
				head_column.id === this.store.sort_by && this.store.sort_dir === 'asc';
			
			const sort_dsc =
				head_column.id === this.store.sort_by && this.store.sort_dir === 'dsc';

			return {
				'sort': true,
				'glyphicon': true,
				'glyphicon-sort': sort_none,
				'glyphicon-sort-by-alphabet': sort_asc,
				'glyphicon-sort-by-alphabet-alt': sort_dsc,
			}
		},
		updateStore(data){
			if(typeof data === 'object'){
				this.store = new Vue(json_store);
			}

			this.store.table = this;
			this.store.filterable = this.filterable;
			this.store.paginate = this.paginate;
			this.store.data = data;
		}
	},
	created(){
		this.updateStore(this.data);
	},
	watch: {
		data(){
			this.updateStore(this.data);
		}
	}
}
</script>