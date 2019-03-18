/*#if _DISPLAY == 1
import { queryApiForData } from 'utils';
//#endif */

/* globals Vue, _ */

new Vue( {
	el:   '#demo-app',
	data: {
		filter:  '',
		columns: [
			{ label: 'ID', field: 'id', align: 'center', filterable: false },
			{ label: 'Username', field: 'user.username' },
			{ label: 'First Name', field: 'user.first_name' },
			{ label: 'Last Name', field: 'user.last_name' },
			{ label: 'Email', field: 'user.email', align: 'right', sortable: false },
			{ label: 'Address', representedAs: row => `${ row.address  }, ${ row.city  }, ${ row.state }`, align: 'right', sortable: false },
		],
		async someLongOperation( params ){
			this.$root.$data.callsCount++;
/*#if _DISPLAY == 1
			const { data, totalRows } = await queryApiForData( params );
			
			return {
				rows:          data,
				totalRowCount: totalRows,
			};
//#else */
			// This part is only for the executable code in the demo page
			// Wait some time to simulate HTTP request
			await new Promise( resolve => setTimeout( resolve, ( Math.random() * 400 ) + 100 ) );
			const ensurePromise = value => {
				if ( value && typeof value.then === 'function' )  {
					return value;
				} else {
					return Promise.resolve( value );
				}
			};
			const outObj =  { source: window.rows };
			return ensurePromise( this.handler.filterHandler( window.rows, this.filter, this.normalizedColumns ) )
				.then( filteredData => ensurePromise( this.handler.sortHandler( outObj.filtered = filteredData, this.sortBy, this.sortDir ) ) )
				.then( sortedData => ensurePromise( this.handler.paginateHandler( outObj.sorted = sortedData, this.perPage, this.page ) ) )
				.then( pagedData => ensurePromise( this.handler.displayHandler( Object.assign( {paged: pagedData}, outObj ) ) ) )
				.then( tableContent => ensurePromise( this.setTableContent( tableContent ) ) );
			// Below is only for the displayed content in the demo page
//#endif
		},
		page:       1,
		callsCount: 0,
	},
	mounted(){
		this.$datatables.debounced.processRows = _.debounce( this.$datatables.debounced.processRows, 1000 );
	},
} );
