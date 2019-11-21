import { ChildProcess, exec, spawn } from 'child_process';
import { logDebug } from './log';

export const spawnStream = async ( cmd: string, args: string[], attachOuts?: boolean ) => {
	const prefix = `${cmd} ${args.join( ' ' )}`;
	const cmdProcess = spawn( cmd, args );
	return streamChildProcess( cmdProcess, prefix, attachOuts );
};
export const execStream = async ( cmd: string, attachOuts?: boolean ) => {
	const cmdProcess = exec( cmd );
	return streamChildProcess( cmdProcess, cmd, attachOuts );
};

const loggableData = ( buffer: Buffer ) => buffer.toString().replace( /\r?\n$/, '' );
const formatOutputText = ( prefix: string, data: string | Buffer ) => {
	const dataStr = typeof data === 'string' ? data : loggableData( data );
	const padLeft = prefix.replace( /.(?!$)/g, ' ' ).replace( /.$/g, '|' ) + ' ';
	return `${prefix} ${dataStr.replace( /\r?\n/g, '\n' + padLeft )}`;
};

const streamChildProcess = async ( child: ChildProcess, logPrefix: string, attachOuts = false ) => new Promise<void>( ( res, rej ) => {
	if ( attachOuts ) {
		if ( child.stdout ) {
			child.stdout.on( 'data', data => {
				logDebug( formatOutputText( `"${logPrefix}" stdout:`, data ) );
			} );
		}

		if ( child.stderr ) {
			child.stderr.on( 'data', data => {
				logDebug( formatOutputText( `"${logPrefix}" stderr:`, data ) );
			} );
		}

		child.on( 'exit', code => {
			if ( code === 0 ) {
				return res();
			} else {
				// Create the error
				const err = new Error( `Child process exited with code ${code}` );
				( err as any ).code = code;
				return rej( err );
			}
		} );
	} else {
		let stdout = '';
		let stderr = '';
		if ( child.stdout ) {
			child.stdout.on( 'data', data => {
				stdout += '\n' + loggableData( data );
			} );
		}

		if ( child.stderr ) {
			child.stderr.on( 'data', data => {
				stderr += '\n' + loggableData( data );
			} );
		}

		child.on( 'exit', code => {
			if ( code === 0 ) {
				return res();
			} else {
				// Log command outputs for debugging purposes
				logDebug( formatOutputText( `"${logPrefix}" stdout:`, stdout ) );
				logDebug( formatOutputText( `"${logPrefix}" stderr:`, stderr ) );

				// Create the error
				const err = new Error( `Child process exited with code ${code}` );
				( err as any ).code = code;
				return rej( err );
			}
		} );
	}
} );
