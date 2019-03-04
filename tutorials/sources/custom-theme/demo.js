/* globals VuejsDatatable, Vue */

VuejsDatatable.useDefaultType(false)
	.registerTableType('datatable', tableType => {
		tableType.mergeSettings({
			table: {
				class:   'table table-hover table-striped',
				sorting: {
					sortNone: '<i class="glyphicon glyphicon-sort"></i>',
					sortAsc:  '<i class="glyphicon glyphicon-sort-by-attributes"></i>',
					sortDesc: '<i class="glyphicon glyphicon-sort-by-attributes-alt"></i>',
				},
			},
			pager: {
				classes: {
					pager:    'pagination text-center',
					selected: 'active',
				},
				icons: {
					previous: '<i class="glyphicon glyphicon-chevron-left"></i>',
					next:     '<i class="glyphicon glyphicon-chevron-right"></i>',
				},
			},
		});
	});

new Vue({
	el:   '#demo-app',
	data: {
		filter:  '',
		columns: [
			{
				label: 'id',
				field: 'id',
			},
			{
				label: 'Username',
				field: 'user.username',
			},
			{
				label: 'First Name',
				field: 'user.first_name',
			},
			{
				label: 'Last Name',
				field: 'user.last_name',
			},
			{
				label: 'Email',
				field: 'user.email',
			},
			{
				label:         'address',
				representedAs: row =>`${ row.address  }<br />${  row.city  }, ${  row.state }`,
				interpolate:   true,
				sortable:      false,
				filterable:    false,
			},
		],
		rows: window.rows,
		page: 1,
	},
});
