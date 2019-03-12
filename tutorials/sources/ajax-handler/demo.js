import { makeQueryStringFromObj, formatUtcDate } from '../utils.js';

/* globals VuejsDatatable, axios, Vue */

VuejsDatatable.registerTableType( 'ajaxtable', tableType => {
	tableType
		.setFilterHandler( ( source, filter, columns ) => ( {
			// See https://documenter.getpostman.com/view/2025350/RWaEzAiG#json-field-masking
			filter: columns.map( col => col.field.replace( /\./g, '/' ) ).join( ',' ),
		} ) )
		.setSortHandler( ( endpointDesc, sortColumn, sortDir ) => 
			Object.assign( {}, endpointDesc, sortColumn && sortDir ? {
				sort:  sortColumn.field.replace( /\./g, '/' ),
				order: sortDir, 
			} : {} ) )
		.setPaginateHandler( ( endpointDesc, perPage, pageIndex ) => 
			Object.assign( {}, endpointDesc, {
				offset: ( ( pageIndex - 1 ) * perPage ) || 0,
				limit:  perPage || 10, 
			} ) )
		// Alias our process steps, because the source, here, is our API url, and paged is the complete query string
		.setDisplayHandler( async ( { source: baseEndPoint, paged: endpointDesc } ) => {
			const url = `${ baseEndPoint }?${ makeQueryStringFromObj( endpointDesc ) }`;

			const {
				// Data to display
				data,
				// Get the total number of matched items
				headers: {'spacex-api-count': totalCount}, 
			} = await axios.get( url );
			
			return {
				rows:          data,
				totalRowCount: totalCount,
			};
		} );
} );

new Vue( {
	el:   '#demo-app',
	data: {
		columns: [
			{ label: 'Flight number', field: 'flight_number' },
			{ label: 'Mission name', field: 'mission_name' },
			{ label: 'Launch date', field: 'launch_date_utc', representedAs: row => formatUtcDate( new Date( row.launch_date_utc ) ) },
			{ label: 'Rocket type', field: 'rocket.rocket_name', sortable: false },
			{ label: 'Launch site', field: 'launch_site.site_name_long', sortable: false },
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
		page:           1,
		apiUrlUpcoming: 'https://api.spacexdata.com/v3/launches/upcoming',
		apiUrlPast:     'https://api.spacexdata.com/v3/launches/past',
	},
} );
