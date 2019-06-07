import { F_OK } from 'constants';
import { promises } from 'fs';
// tslint:disable-next-line: no-implicit-dependencies
import jscc from 'jscc';
import { basename, dirname, join, relative, resolve } from 'path';

import { tempDir } from './build-utils';

export const readFile = async ( path: string, encoding = 'UTF-8' ) => {
	const content = await promises.readFile( path, encoding );
	if ( content instanceof Buffer ) {
		return content.toString( encoding );
	}
	return content;
};

const wrapScript = ( script: string ) =>
	`let inited = false;
const runDemo = () => {
	if ( inited ) {
		return;
	}
	inited = true;

	// -----------------------------

${ script.trim().split( /\n/g ).map( s => `\t${s}` ).join( '\n' ) }
}

( document as any ).addEventListener && ( document as any ).addEventListener( 'DOMContentLoaded', runDemo, false );
( window as any ).addEventListener && ( window as any ).addEventListener( 'load', runDemo, false );
( document as any ).attachEvent && ( document as any ).attachEvent( 'onreadystatechange', runDemo );
( window as any ).attachEvent && ( window as any ).attachEvent( 'onload', runDemo );
`;

export const generateWrappedScript = async ( sourceFile: string ) => {
	const { code: content } = jscc( await readFile( sourceFile ), sourceFile, { values: { _DISPLAY: '0' }} );

	try {
		await promises.access( tempDir, F_OK );
	} catch {
		await promises.mkdir( tempDir );
	}
	const tempFile = resolve( tempDir, `${ basename( dirname( sourceFile ) ) }.ts` );

	// Extract imports
	const hoistedStatements: string[] = [];
	const contentNoHoist = content.replace( /import\s+(?:.*?from\s+)?(['"])(\S+)\1;?/g, ( fullMatch, quoteType: string, targetModulePath: string ) => {
		const moduleNameStr = quoteType + targetModulePath + quoteType;
		if ( targetModulePath.startsWith( '.' ) ) {
			const resolvedFilePath = relative( tempDir, sourceFile );
			const relativeModule = join( dirname( resolvedFilePath ), targetModulePath ).replace( /\\/g, '/' );
			hoistedStatements.push( fullMatch.replace( moduleNameStr, `'${relativeModule}'` ) );
		} else {
			hoistedStatements.push( fullMatch.replace( moduleNameStr, `'${targetModulePath}'` ) );
		}
		return '';
	} ).trim().replace( /^\s*declare\s+(var|let|const)\s+.*?$/gm, fullMatch => {
		hoistedStatements.push( fullMatch );
		return '';
	} ).trim();
	await promises.writeFile( tempFile, `${hoistedStatements.map( s => s.trim() ).join( '\n' )}

${wrapScript( contentNoHoist )}` );
	return tempFile;
};
