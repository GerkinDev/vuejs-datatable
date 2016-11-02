<style scoped>
	table th .sort {
		cursor: pointer;
	}
</style>

<template>
	<div class="row">
		<div class="col-xs-12">
			
			<component :is="filterBar"
				v-if="filterable || paginate"
				:columns="column_props"
				:rows="sorted_rows"
				:filterable="filterable"
				:paginate="paginate"
				@change="updateRows"
			></component>


			<table class="table table-hover table-striped">
				<thead>
					<tr>
						<th v-for="head_column in column_props" :style="{'text-align': head_column.align}">
							{{ head_column.label }}
							<span
								v-if="head_column.sortable"
								:class="{
									'sort': true,
									'glyphicon': true,
									'glyphicon-sort': head_column.id !== sort_by || !sort_dir,
									'glyphicon-sort-by-alphabet': head_column.id === sort_by && sort_dir === 'asc',
									'glyphicon-sort-by-alphabet-alt': head_column.id === sort_by && sort_dir === 'dsc',
								}"
								@click="sortBy(head_column.id)"
							></span>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in visible_rows">
						<td v-for="row_column in column_props" :style="{'text-align': row_column.align}">
							<span v-if="row_column.field">{{ row[row_column.field] }}</span>
							<span v-if="row_column.callback">{{ row_column.callback(row) }}</span>
							<component v-if="row_column.component" :is="row_column.component" :row="row"></component>
						</td>
					</tr>
				</tbody>
			</table>

		</div>
	</div>
</template>

<script>
module.exports = {
	props: {
		columns: [Object, Array],
		rows: [Object, Array],
		filterable: {
			type: Boolean,
			default: false
		},
		paginate: {
			type: Boolean,
			default: false
		},
		filterBar: {
			type: String,
			default: 'filter-bar'
		}
	},
	data: function(){return {
		visible_rows: [],
		sort_by: null,
		sort_dir: null,
	}},
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
		},
		sorted_rows: function(){
			var column = this.column_props[this.sort_by];

			if(!column || this.sort_by === null){
				return this.rows;
			}

			return this.rows.sort(function(a,b){
				var value_a = column.callback ? column.callback(a) : a[column.field];
				var value_b = column.callback ? column.callback(b) : b[column.field];

				if(value_a == value_b){
					return 0;
				}

				var sort_val = value_a > value_b ? 1 : -1;

				if(this.sort_dir === 'dsc'){
					sort_val *= -1;
				}

				return sort_val;
			}.bind(this));
		}
	},
	methods: {
		updateRows: function(rows){
			this.visible_rows = rows;
		},
		sortBy: function(column_id){
			if(this.sort_by === column_id){
				switch(this.sort_dir){
					case null:
						this.sort_dir = 'asc';
						break;
					case 'asc':
						this.sort_dir = 'dsc';
						break;
					case 'dsc':
						this.sort_dir = null;
						break;
				}

				return;
			}

			this.sort_by = column_id;
			this.sort_dir = 'asc';
		}
	},
	components: {
		filterBar: require('./filter-bar.vue')
	},
	created: function(){
		this.visible_rows = this.sorted_rows;
	}
}
</script>