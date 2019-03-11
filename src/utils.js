export const ensurePromise = value => {
	if ( value && typeof value.then === 'function' )  {
		return value;
	} else {
		return Promise.resolve( value );
	}
};
