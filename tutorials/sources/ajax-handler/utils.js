const padLeft0 = (str, targetLength) => '0'.repeat(targetLength - `${ str }`.length) + str;
export const makeQueryStringFromObj = obj => Object
	.entries(obj)
	.map(([ key, val ]) => `${ encodeURIComponent(key) }=${ encodeURIComponent(val) }`)
	.join('&');
export const formatUtcDate = dateTime => {
	const date = `${ padLeft0(dateTime.getUTCMonth() + 1, 2) }/${ padLeft0(dateTime.getUTCDay(), 2) }/${ padLeft0(dateTime.getUTCFullYear(), 4) }`;
	const amPm = dateTime.getUTCHours() === 0 || dateTime.getUTCHours() < 12 ? 'am' : 'pm';
	const hour = dateTime.getUTCHours() % 12 ? dateTime.getUTCHours() % 12 : 12;
	const time = `${ padLeft0(hour, 2) }:${ padLeft0(dateTime.getUTCMinutes(), 2) }${ amPm } UTC`;
	return `${ date } ${ time }`;
};
