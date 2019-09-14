
export type TMaybePromise<T> = T | Promise<T>;

const isPromise = <T>( value: any ): value is Promise<T> => value && typeof value.then === 'function';
export const ensurePromise = <T>( value: TMaybePromise<T> ): Promise<T> => {
	if ( isPromise( value ) )  {
		return value;
	} else {
		return Promise.resolve( value );
	}
};

export interface IDict<T> {[key: string]: T; }
export type TClassVal = string | string[] | IDict<boolean>;
export const classValType: any[] = [ String, Array, Object ];
export const mergeClassVals = ( mainObj: TClassVal, ...objs: Array<TClassVal | null | undefined> ): string[] =>
	Object.entries(
		Object.assign(
			canonicalClassVals( mainObj ),
			...( objs.map( v => canonicalClassVals( v ) ) ) ) as IDict<boolean> )
	.filter( ( [, enabled] ) => enabled )
	.map( ( [className] ) => className );

const canonicalClassVals = ( classVal: TClassVal | null | undefined ): IDict<boolean> => {
	if ( typeof classVal === 'string' ) {
		classVal = classVal.split( /\s+/g );
	}
	if ( Array.isArray( classVal ) ) {
		return classVal.reduce( ( acc, className ) => {
			acc[className] = true;
			return acc;
		},                      {} as IDict<boolean> );
	}
	return classVal || {};
};

export const namespace = 'vue-datatable';
export const namespaceEvent = ( event: string ) => `${namespace}::${event}`;

/**
 * Enumeration of text alignment in a cell.
 */
export const enum EColAlign {
	Left = 'left',
	Center = 'center',
	Right = 'right',
}

/**
 * Enumeration of the different display modes available for the pager.
 *
 * @tutorial pager-types
 */
export const enum EPagerType {
	Short = 'short',
	Abbreviated = 'abbreviated',
	Long = 'long',
}

export const valueToString = ( val: any ): string => {
	if ( val === null || typeof val === 'undefined' ) {
		return '';
	} else {
		return val.toString();
	}
};
