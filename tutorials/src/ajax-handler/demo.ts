import axios from 'axios';
import Vue from 'vue';
import { TColumnsDefinition, VuejsDatatableFactory } from 'vuejs-datatable';

import { colFieldToStr, formatUtcDate, ISpaceXLaunch, makeQueryStringFromObj } from '../utils';

VuejsDatatableFactory.registerTableType<any, any, any, any, any>( 'ajaxtable', tableType => tableType
	.setFilterHandler( ( source, filter, columns ) => ( {
		// See https://documenter.getpostman.com/view/2025350/RWaEzAiG#json-field-masking
		filter: columns.map( col => colFieldToStr( col.field! ).replace( /\./g, '/' ) ).join( ',' ),
	} ) )
	.setSortHandler( ( endpointDesc, sortColumn, sortDir ) => ( {
		...endpointDesc,

		...( sortColumn && sortDir ? {
			order: sortDir,
			sort:  colFieldToStr( sortColumn.field! ).replace( /\./g, '/' ),
		} : {} ),
	 } ) )
	.setPaginateHandler( ( endpointDesc, perPage, pageIndex ) => ( {
		...endpointDesc,

		...( perPage !== null ? {
			limit:  perPage || 10,
			offset: ( ( pageIndex - 1 ) * perPage ) || 0,
		} : {} ),
	} ) )
	// Alias our process steps, because the source, here, is our API url, and paged is the complete query string
	.setDisplayHandler( async ( { source: baseEndPoint, paged: endpointDesc } ) => {
		const url = `${ baseEndPoint }?${ makeQueryStringFromObj( endpointDesc ) }`;

		const {
			// Data to display
			data,
			// Get the total number of matched items
			headers: { 'spacex-api-count': totalCount },
		} = await axios.get<ISpaceXLaunch[]>( url );

		return {
			rows:          data,
			totalRowCount: parseInt( totalCount, 10 ),
		};
	} ) );

const app = new Vue( {
	el:   '#demo-app',
	data: {
		columns: [
			{ label: 'Flight number', field: 'flight_number' },
			{ label: 'Mission name', field: 'mission_name' },
			{ label: 'Launch date', field: 'launch_date_utc', representedAs: row => formatUtcDate( new Date( row.launch_date_utc ) ) },
			{ label: 'Rocket type', field: 'rocket.rocket_name', sortable: false },
			{ label: 'Launch site', field: 'launch_site.site_name_long', sortable: false },
			{
				field:         'links.mission_patch_small',
				interpolate:   true,
				label:         'Mission patch',
				representedAs: row => row.links.mission_patch_small ?
					`<img src="${ row.links.mission_patch_small }" alt="${ row.mission_name } patch" style="height: 6em;"/>` :
					`<img src="https://www.gvmc.gov.in/wss/images/noimageavailable.png" alt="No patch for mission &quot;${ row.mission_name }&quot; available" style="height: 6em;"/>`,
				sortable:      false,
			},
			{
				field:         'links.reddit_campaign',
				interpolate:   true,
				label:         'Reddit link',
				representedAs: row => `<a href="${ row.links.reddit_campaign }">${ row.mission_name } Reddit thread</a>`,
				sortable:      false,
			},
		] as TColumnsDefinition<ISpaceXLaunch>,
		page:           1,

		apiUrlPast:     'https://api.spacexdata.com/v3/launches/past',
		apiUrlUpcoming: 'https://api.spacexdata.com/v3/launches/upcoming',
	},
} );
