<style></style>

<template>
	<div class="row">
		<div class="col-xs-12">
			
			<component :is="filterBar"
				v-if="filterable || paginate"
				:rows="rows"
				:filterable="filterable"
				:paginate="paginate"
				@change="updateRows"
			></component>


			<table class="table table-hover table-striped">
				<thead>
					<tr>
						<th v-for="column in columns" :style="{'text-align': column.align ? column.align : 'left'}">{{ column.label }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in visible_rows">
						<td v-for="column in columns" :style="{'text-align': column.align ? column.align : 'left'}">
							<span v-if="column.field">{{ row[column.field] }}</span>
							<span v-if="column.callback">{{ column.callback(row) }}</span>
							<component v-if="column.component" :is="column.component" :row="row"></component>
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
		visible_rows: []
	}},
	methods: {
		updateRows: function(rows){
			this.visible_rows = rows;
		}
	},
	components: {
		filterBar: require('./filter-bar.vue')
	},
	created: function(){
		this.visible_rows = this.rows;
	}
}
</script>