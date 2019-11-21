// tslint:disable-next-line: no-implicit-dependencies
import chalk from 'chalk';

// tslint:disable: no-console
export const logStep = ( str: string ) => console.log( chalk.cyan( `==> ${str}` ) );
export const logError = ( str: string ) => console.error( chalk.red( `[ERR] ${str}` ) );
export const logDebug = ( str: string ) => console.debug( chalk.magenta( `[DBG] ${str}` ) );
export const logInfo = ( str: string ) => console.info( chalk.blue( `[INF] ${str}` ) );
