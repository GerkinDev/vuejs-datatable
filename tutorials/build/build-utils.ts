import { resolve } from 'path';

export const rewriteBaseVueApp = ( page: string, vueApp: string, pageSlug: string ) => {
	pageSlug = `tutorial-${pageSlug}`;
	const vueAppSegments = vueApp.match( /<div[^>]+id="demo-app"[^>]*>/ );
	if ( !vueAppSegments || vueAppSegments.length === 0 ) {
		throw new Error();
	}

	const openingDivApp = vueAppSegments[0];
	const openingDivClass = openingDivApp.match( /(\sclass=")([^"]*)(")/ );

	const newOpeningDiv = openingDivClass ?
		openingDivApp.replace( openingDivClass[0], `$1${pageSlug} $2$3` ) :
		openingDivApp.replace( '>', ` class="${pageSlug}">` );
	return page.replace( vueApp, vueApp.replace( openingDivApp, newOpeningDiv ).split( '\n' ).map( s => s.trim() ).join( '' ) );
};

export const tempDir = resolve( __dirname, '..', '.tmp' );
