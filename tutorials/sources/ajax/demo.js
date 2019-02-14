import {
	makeQueryStringFromObj, formatUtcDate, 
} from './utils.js';

/* globals VuejsDatatable, axios, Vue */


VuejsDatatable.registerTableType('ajaxtable', tableType => {
	tableType.setFilterHandler((endpoint, filterBy, columns) => {
		// See https://documenter.getpostman.com/view/2025350/RWaEzAiG#json-field-masking
		const columnsNames = columns.map(col => col.field.replace(/\./g, '/')).join(',');

		return {
			baseEndpoint: endpoint,
			filter:       columnsNames,
		};
	});
	tableType.setSortHandler((endpointDesc, sortColumn, sortDir) => 
		Object.assign(
			{},
			endpointDesc,
			sortColumn && sortDir ? {
				sort:  sortColumn.field.replace(/\./g, '/'),
				order: sortDir, 
			} : {}
		));
		
	tableType.setPaginateHandler((endpointDesc, perPage, pageIndex) =>
		Object.assign(
			{},
			endpointDesc,
			{
				offset: ((pageIndex - 1) * perPage) || 0,
				limit:  perPage || 10, 
			}
		));

	tableType.setDisplayHandler(async(endpointDesc, processSteps, setRows, setTotalRowCount) => {
		// Retrieve the endpoint & delete it, to get only the params object
		const baseEndpoint = endpointDesc.baseEndpoint;
		delete endpointDesc.baseEndpoint;

		const dataUrl = `${ baseEndpoint }?${ makeQueryStringFromObj(endpointDesc) }`;
		const dataCountUrl = `${ baseEndpoint }?${ makeQueryStringFromObj({
			filter: 'nope',
			limit:  100,
		}) }`;

		const [ data, dataCount ] = await Promise.all([
			axios.get(dataUrl).then(response => response.data),
			axios.get(dataCountUrl).then(response => response.data.length),
		]);

		setTotalRowCount(dataCount);
		setRows(data);
	});
});

new Vue({
	el:   '#demo-app',
	data: {
		columns: [
			{
				label: 'Flight number',
				field: 'flight_number',
			},
			{
				label: 'Mission name',
				field: 'mission_name',
			},
			{
				label:         'Launch date',
				field:         'launch_date_utc',
				representedAs: row => formatUtcDate(new Date(row.launch_date_utc)),
			},
			{
				label:    'Rocket type',
				field:    'rocket.rocket_name',
				sortable: false,
			},
			{
				label:    'Launch site',
				field:    'launch_site.site_name_long',
				sortable: false,
			},
			{
				label:         'Mission patch',
				field:         'links.mission_patch_small',
				representedAs: row => row.links.mission_patch_small ?
					`<img src="${ row.links.mission_patch_small }" alt="${ row.mission_name } patch" style="height: 6em;"/>` :
					`<img src="https://www.gvmc.gov.in/wss/images/noimageavailable.png" alt="No patch for mission &quot;${ row.mission_name }&quot; available" style="height: 6em;"/>`,
				interpolate: true,
				sortable:    false,
			},
			{
				label:         'Reddit link',
				field:         'links.reddit_campaign',
				representedAs: row => `<a href="${ row.links.reddit_campaign }">${ row.mission_name } Reddit thread</a>`,
				interpolate:   true,
				sortable:      false,
			},
		],
		url:  'https://api.spacexdata.com/v3/launches/upcoming',
		page: 1,
	},
});
