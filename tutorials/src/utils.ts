import { Dictionary, isArray } from 'lodash';
import { Path } from 'object-path';

const padLeft0 = ( str: string | number, targetLength: number ) => '0'.repeat( targetLength - `${ str }`.length ) + str;
export const makeQueryStringFromObj = ( obj: Dictionary<any> ) => Object
	.entries( obj )
	.map( ( [ key, val ] ) => `${ encodeURIComponent( key ) }=${ encodeURIComponent( val ) }` )
	.join( '&' );
export const formatUtcDate = ( dateTime: Date ) => {
	const date = `${ padLeft0( dateTime.getUTCMonth() + 1, 2 ) }/${ padLeft0( dateTime.getUTCDate(), 2 ) }/${ padLeft0( dateTime.getUTCFullYear(), 4 ) }`;
	const amPm = dateTime.getUTCHours() === 0 || dateTime.getUTCHours() < 12 ? 'am' : 'pm';
	const hour = dateTime.getUTCHours() % 12 ? dateTime.getUTCHours() % 12 : 12;
	const time = `${ padLeft0( hour, 2 ) }:${ padLeft0( dateTime.getUTCMinutes(), 2 ) }${ amPm } UTC`;
	return `${ date } ${ time }`;
};
export const colFieldToStr = ( path: symbol | Path | null ) => {
	if ( path === null ) {
		throw new Error();
	}
	return isArray( path ) ? path.join( '.' ) : String( path );
};

export interface ISpaceXLaunch {
	flight_number: string;
	mission_name: string;
	launch_date_utc: string;
	rocket: {
		rocket_name: string;
	};
	launch_site: {
		site_name_long: string;
	};
	links: {
		mission_patch_small: string;
		reddit_campaign: string;
	};
}
export interface IPeople {
	id: number;

	address: string;
	city: string;
	state: string;

	user: {
		username: string;
		first_name: string;
		last_name: string;
		email: string;
	};
}
