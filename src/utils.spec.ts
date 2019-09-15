import { ensurePromise, mergeClassVals, TClassVal } from './utils';

describe( 'Ensure promise', () => {
	it( 'Should return a promise as-is', () => {
// tslint:disable-next-line: no-inferred-empty-object-type
		const val = new Promise( () => ( {} ) );
// tslint:disable-next-line: no-floating-promises
		expect( ensurePromise( val ) ).toBe( val );
	} );
	it( 'Should return a promise-like as-is', () => {
		const val = { then: () => ( {} ) };
		// tslint:disable-next-line: no-floating-promises
		expect( ensurePromise( val ) ).toBe( val );
	} );
	it( 'Should wrap a non-promise-like in a promise', async () => {
		const val = {};
		const ensured = ensurePromise( val );
		// tslint:disable-next-line: no-floating-promises
		expect( ensured ).toBeInstanceOf( Promise );
		// tslint:disable-next-line: no-inferred-empty-object-type
		expect( await ensured ).toBe( val );
	} );
} );
describe( 'Merge class lists', () => {
	it.each`
	a                         | b                         | result
	${undefined}              | ${undefined}              | ${[]}
	${undefined}              | ${'baz qux'}              | ${['baz', 'qux']}
	${undefined}              | ${['baz', 'qux']}         | ${['baz', 'qux']}
	${undefined}              | ${{ baz: true, qux: true }} | ${['baz', 'qux']}
	${'foo bar'}              | ${'baz qux'}              | ${['foo', 'bar', 'baz', 'qux']}
	${'foo bar'}              | ${['baz', 'qux']}         | ${['foo', 'bar', 'baz', 'qux']}
	${'foo bar'}              | ${{ baz: true, qux: true }} | ${['foo', 'bar', 'baz', 'qux']}
	${['foo', 'bar']}         | ${['baz', 'qux']}         | ${['foo', 'bar', 'baz', 'qux']}
	${['foo', 'bar']}         | ${{ baz: true, qux: true }} | ${['foo', 'bar', 'baz', 'qux']}
	${{ foo: true, bar: true }} | ${{ baz: true, qux: true }} | ${['foo', 'bar', 'baz', 'qux']}
	`( 'Merge `$a` with `$b` should result in `$result`', ( { a, b, result }: {a: TClassVal; b: TClassVal; result: string[]} ) => {
		expect( mergeClassVals( a, b ) ).toEqual( result );
	} );
} );
