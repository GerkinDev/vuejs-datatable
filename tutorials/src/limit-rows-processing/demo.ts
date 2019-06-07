import { debounce } from 'lodash';
import Vue from 'vue';
import { IDataFnParams, IDisplayHandlerParam, ITableContentParam, TColumnsDefinition, VueDatatable } from 'vuejs-datatable';

import { IPeople } from '../utils';
/*#if _DISPLAY == 1
import { queryApiForData } from '../utils';
//#endif */
declare var rows: IPeople[];

const app = new Vue( {
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
		] as TColumnsDefinition<IPeople>,
		async someLongOperation( this: VueDatatable<IPeople, any>, params: IDataFnParams<IPeople> ): Promise<ITableContentParam<IPeople>> {
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
			await new Promise<void>( resolve => setTimeout( resolve, ( Math.random() * 400 ) + 100 ) );
			const ensurePromise = <T>( value: T | Promise<T> ): Promise<T> => {
				if ( value && typeof ( value as any ).then === 'function' )  {
					return value as Promise<T>;
				} else {
					return Promise.resolve( value );
				}
			};
			const outObj: Partial<IDisplayHandlerParam<IPeople, any, any, any, any>> =  { source: rows };
			return ensurePromise( this.handler.filterHandler( rows, params.filter, this.normalizedColumns ) )
				.then( filteredData => ensurePromise( this.handler.sortHandler( outObj.filtered = filteredData, { field: params.sortBy } as any, params.sortDir ) ) )
				.then( sortedData => ensurePromise( this.handler.paginateHandler( outObj.sorted = sortedData, params.perPage, this.page ) ) )
				.then( pagedData => ensurePromise( this.handler.displayHandler( Object.assign( { paged: pagedData }, outObj ) as IDisplayHandlerParam<IPeople, any, any, any, any> ) ) );
			// Below is only for the displayed content in the demo page
// #endif
		},
		page:       1,
		callsCount: 0,
	},
	mounted() {
		this.$datatables.debounced.processRows = debounce( this.$datatables.debounced.processRows, 1000 );
	},
} );
