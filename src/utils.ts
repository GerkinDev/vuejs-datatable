const isPromise = <T>( value: any ): value is Promise<T> => value && typeof value.then === 'function';
export const ensurePromise = <T>( value: T | Promise<T> ): Promise<T> => {
	if ( isPromise( value ) )  {
		return value;
	} else {
		return Promise.resolve( value );
	}
};

export interface IDict<T> {[key: string]: T; }
export type TClassVal = string | string[] | IDict<boolean>;
export const classValType: any[] = [ String, Array, Object ];
export const mergeClassVals = ( mainObj: TClassVal, ...objs: Array<TClassVal | null> ): IDict<boolean> =>
	Object.assign( canonicalClassVals( mainObj ), ...( objs.filter( <T>( v: T | null ): v is T => v !== null ).map( v => canonicalClassVals( v ) ) ) );
const canonicalClassVals = ( classVal: TClassVal ): IDict<boolean> => {
	if ( typeof classVal === 'string' ) {
		return { [classVal]: true };
	}
	if ( Array.isArray( classVal ) ) {
		return classVal.reduce( ( acc, className ) => {
			acc[className] = true;
			return acc;
		},                      {} as IDict<boolean> );
	}
	return classVal;
};
