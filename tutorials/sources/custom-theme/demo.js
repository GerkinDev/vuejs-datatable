/* globals VuejsDatatable, Vue */

VuejsDatatable.useDefaultType(false)
	.registerTableType('datatable', tableType => {
		tableType.mergeSettings({
			table: {
				class:   'hover table-scroll',
				sorting: {
					classes: {
						canSort:  [ 'sort' ],
						sortNone: [ 'fa', 'fa-sort' ],
						sortAsc:  [ 'fa', 'fa-sort-asc' ],
						sortDesc: [ 'fa', 'fa-sort-desc' ],
					},
				},
			},
			pager: {
				classes: {
					pager:    'pagination text-center',
					selected: 'current',
				},
			},
		});
	});

new Vue({
	el:   '.grid-container',
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
