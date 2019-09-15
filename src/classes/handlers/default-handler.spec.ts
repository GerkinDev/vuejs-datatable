jest.mock( '../column' );
import { Column } from '../column';
import { DefaultHandler } from './default-handler';

const rows = [
	{ id: 1, user: { firstName: 'John', lastName: 'Doe' }, order: 2, eq: 42 },
	{ id: 2, user: { firstName: 'Jane', lastName: 'Doe' }, order: 1, eq: 42 },
	{ id: 3, user: { firstName: 'Foo', lastName: 'Bar' }, order: 3, eq: 42 },
];
type RowType = typeof rows[0];

const columns = [
	new Column( { label: '', field: 'id' } ),
	new Column( { label: '', field: 'user.lastName' } ),
	new Column( { label: '', representedAs: ( row: any ) => row.user.firstName + row.user.lastName } ),
	new Column( { label: '', field: 'order' } ),
	new Column( { label: '', field: 'eq' } ),
];

it( 'has the correct methods', () => {
	const handler = new DefaultHandler();

	expect( typeof handler.filterHandler ).toBe( 'function' );
	expect( typeof handler.sortHandler ).toBe( 'function' );
	expect( typeof handler.paginateHandler ).toBe( 'function' );
	expect( typeof handler.displayHandler ).toBe( 'function' );
} );

describe( 'can filter data', () => {
	it( 'Filter data with nil value or empty array should directly return input', async () => {
		const handler = new DefaultHandler<RowType>();
		const rowMatchSpied = jest.spyOn( handler, 'rowMatches' );

		let filtered = await handler.filterHandler( rows, undefined, columns );
		expect( rowMatchSpied ).not.toHaveBeenCalled();
		expect( filtered ).toHaveLength( 3 );
		expect( filtered[0].id ).toBe( 1 );
		expect( filtered[1].id ).toBe( 2 );
		expect( filtered[2].id ).toBe( 3 );

		rowMatchSpied.mockClear();

		filtered = await handler.filterHandler( rows, [], columns );
		expect( rowMatchSpied ).not.toHaveBeenCalled();
		expect( filtered ).toHaveLength( 3 );
		expect( filtered[0].id ).toBe( 1 );
		expect( filtered[1].id ).toBe( 2 );
		expect( filtered[2].id ).toBe( 3 );
	} );
	it( 'can filter data by a single string', async () => {
		const handler = new DefaultHandler<RowType>();
		const rowMatchSpied = jest.spyOn( handler, 'rowMatches' );

		let filtered = await handler.filterHandler( rows, 'jo do', columns );
		expect( rowMatchSpied ).toHaveBeenCalledTimes( 5 );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'jo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'jo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'jo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'do', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'do', columns );
		expect( filtered ).toHaveLength( 2 );
		expect( filtered[0].id ).toBe( 1 );
		expect( filtered[1].id ).toBe( 2 );

		rowMatchSpied.mockClear();

		filtered = await handler.filterHandler( rows, 'nedo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledTimes( 3 );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'nedo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'nedo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'nedo', columns );
		expect( filtered ).toHaveLength( 1 );
		expect( filtered[0].id ).toBe( 2 );

		rowMatchSpied.mockClear();

		filtered = await handler.filterHandler( rows, 'bogus', columns );
		expect( rowMatchSpied ).toHaveBeenCalledTimes( 3 );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'bogus', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'bogus', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'bogus', columns );
		expect( filtered ).toHaveLength( 0 );

		rowMatchSpied.mockClear();

		filtered = await handler.filterHandler( rows, 'j doe', columns );
		expect( rowMatchSpied ).toHaveBeenCalledTimes( 4 );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'j', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'j', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'j', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'doe', columns );
		expect( filtered ).toHaveLength( 2 );
		expect( filtered[0].id ).toBe( 1 );
		expect( filtered[1].id ).toBe( 2 );
	} );
	it( 'can filter data by multiple strings', async () => {
		const handler = new DefaultHandler<RowType>();
		const rowMatchSpied = jest.spyOn( handler, 'rowMatches' );

		let filtered = await handler.filterHandler( rows, ['jo', 'do'], columns );
		expect( rowMatchSpied ).toHaveBeenCalledTimes( 5 );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'jo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'jo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'do', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'jo', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'do', columns );
		expect( filtered ).toHaveLength( 2 );
		expect( filtered[0].id ).toBe( 1 );
		expect( filtered[1].id ).toBe( 2 );

		rowMatchSpied.mockClear();

		filtered = await handler.filterHandler( rows, ['bogus'], columns );
		expect( rowMatchSpied ).toHaveBeenCalledTimes( 3 );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'bogus', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'bogus', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'bogus', columns );
		expect( filtered ).toHaveLength( 0 );

		rowMatchSpied.mockClear();

		filtered = await handler.filterHandler( rows, ['j doe', 'do'], columns );
		expect( rowMatchSpied ).toHaveBeenCalledTimes( 6 );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'j doe', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'j doe', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'j doe', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[0], 'do', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[1], 'do', columns );
		expect( rowMatchSpied ).toHaveBeenCalledWith( rows[2], 'do', columns );
		expect( filtered ).toHaveLength( 2 );
		expect( filtered[0].id ).toBe( 1 );
		expect( filtered[1].id ).toBe( 2 );
	} );
	it( 'Should not filter columns explicitly marked as non-filterable', async () => {
		const handler = new DefaultHandler<RowType>();
		const rowMatchSpied = jest.spyOn( handler, 'rowMatches' );

		const filtered = await handler.filterHandler(
			[{ foo: 'qux', baz: 'bar' }, { foo: 'qux', baz: 'bat' }],
			'bar',
			[new Column( { field: 'foo', filterable: false } ), new Column( { field: 'baz', filterable: true } )],
		);
		expect( filtered ).toHaveLength( 1 );
	} );
} );

describe( 'can sort data', () => {
	it( 'Sort with no column or order should be stable', async () => {
		const handler = new DefaultHandler<RowType>();

		const sorted = await handler.sortHandler( rows, undefined, null );
		expect( sorted ).toHaveLength( 3 );
		expect( sorted[0].id ).toBe( 1 );
		expect( sorted[1].id ).toBe( 2 );
		expect( sorted[2].id ).toBe( 3 );
	} );
	it( 'Sort ascending should sort correctly', async () => {
		const handler = new DefaultHandler<RowType>();

		const sorted = await handler.sortHandler( rows, columns[3], 'asc' );

		expect( sorted ).toHaveLength( 3 );
		expect( sorted[0].id ).toBe( 2 );
		expect( sorted[1].id ).toBe( 1 );
		expect( sorted[2].id ).toBe( 3 );
	} );
	it( 'Sort descending should sort correctly', async () => {
		const handler = new DefaultHandler<RowType>();

		const sorted = await handler.sortHandler( rows, columns[3], 'desc' );

		expect( sorted ).toHaveLength( 3 );
		expect( sorted[0].id ).toBe( 3 );
		expect( sorted[1].id ).toBe( 1 );
		expect( sorted[2].id ).toBe( 2 );
	} );
	it( 'Sort on string should sort alphabetically', async () => {
		const handler = new DefaultHandler<RowType>();

		const sorted = await handler.sortHandler( rows, columns[2], 'asc' );

		expect( sorted ).toHaveLength( 3 );
		expect( sorted[0].id ).toBe( 3 );
		expect( sorted[1].id ).toBe( 2 );
		expect( sorted[2].id ).toBe( 1 );
	} );
	it( 'Sort equal cols value should be stable', async () => {
		const handler = new DefaultHandler<RowType>();

		const sorted = await handler.sortHandler( rows, columns[4], 'desc' );

		expect( sorted ).toHaveLength( 3 );
		expect( sorted[0].id ).toBe( 1 );
		expect( sorted[1].id ).toBe( 2 );
		expect( sorted[2].id ).toBe( 3 );
	} );
} );

describe( 'can paginate data', () => {
	it( 'Normal pagination should return a correct number of items', async () => {
		const handler = new DefaultHandler<RowType>();

		let paged = await handler.paginateHandler( rows, 1, 1 );

		expect( paged ).toHaveLength( 1 );
		expect( paged[0].id ).toBe( 1 );

		paged = await handler.paginateHandler( rows, 1, 2 );

		expect( paged ).toHaveLength( 1 );
		expect( paged[0].id ).toBe( 2 );

		paged = await handler.paginateHandler( rows, 2, 1 );

		expect( paged ).toHaveLength( 2 );
		expect( paged[0].id ).toBe( 1 );
		expect( paged[1].id ).toBe( 2 );
	} );
	it( 'Paginate with 0 or less items per page should skip pagination', async () => {
		const handler = new DefaultHandler<RowType>();

		expect( await handler.paginateHandler( rows, 0, 1 ) ).toBe( rows );
		expect( await handler.paginateHandler( rows, -5, 1 ) ).toBe( rows );
	} );
	it( 'Paginate for page 0 or less should skip pagination', async () => {
		const handler = new DefaultHandler<RowType>();

		expect( await handler.paginateHandler( rows, 1, 0 ) ).toBe( rows );
		expect( await handler.paginateHandler( rows, 1, -5 ) ).toBe( rows );
	} );
} );
it( 'Display handler extracts correct data', async () => {
	const handler = new DefaultHandler<{id: number}>();
	expect( await handler.displayHandler( {
		filtered: [{ id: 1 }, { id: 2 }],
		paged: [{ id: 1 }],
		sorted: [{ id: 1 }, { id: 2 }],
		source: [{ id: 1 }, { id: 2 }, { id: 3 }],
	} ) ).toEqual( { rows: [{ id: 1 }], totalRowCount: 2 } );
} );
