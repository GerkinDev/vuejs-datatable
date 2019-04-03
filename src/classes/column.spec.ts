// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue } from '@vue/test-utils';

import { Column, EColAlign } from './column';

const localVue = createLocalVue();
localVue.component( 'test-component', {
	props:    [ 'row' ],
	template: `
	<span>Test Component</span>
	`,
} );

beforeEach( () => {
	jest.clearAllMocks();
} );
it( 'normalizes properties', () => {
	const column = new Column( { label: '' } );

	expect( column['label'] ).toBe( '' );
	expect( column['align'] ).toBe( 'left' );
	expect( column['field'] ).toBe( null );
	expect( column['representedAs'] ).toBe( null );
	expect( column['component'] ).toBe( null );
	expect( column.sortable ).toBe( false );
	expect( column.filterable ).toBe( false );
} );

it( 'Should normalize alignment', () => {
	expect( Column.normalizeAlignment( 'right' ) ).toBe( EColAlign.Right );
	expect( Column.normalizeAlignment( 'LEFT' ) ).toBe( EColAlign.Left );
	expect( Column.normalizeAlignment( 'foo' ) ).toBe( EColAlign.Left );
	expect( Column.normalizeAlignment( 'foo', EColAlign.Center ) ).toBe( EColAlign.Center );
	expect( Column.normalizeAlignment( undefined, EColAlign.Left ) ).toBe( EColAlign.Left );
} );

it( 'sets field', () => {
	const column = new Column( {
		label: '',
		field: 'user.name',
	} );

	expect( column['field'] ).toBe( 'user.name' );
} );

it( 'sets callback', () => {
	const repFn = jest.fn( () => 'test' );
	const testObj = {};
	const column = new Column( {
		label: '',
		representedAs: repFn,
	} );

	expect( typeof column['representedAs'] ).toBe( 'function' );
	expect( column.getRepresentation( testObj ) ).toBe( 'test' );
	expect( repFn ).toHaveBeenCalledTimes( 1 );
	expect( repFn ).toHaveBeenCalledWith( testObj );
} );

it( 'sets component', () => {
	const column = new Column( {
		label: '',
		component: 'test-component',
	} );

	expect( column['component'] ).toBe( 'test-component' );
} );

it( 'sets sortability', () => {
	// components should not be sortable by default
	expect( ( new Column( {
		label: '',
		component: 'test-component',
	} ) ).sortable ).toBe( false );

	// component columns that specify a field should be sortable
	expect( ( new Column( {
		label: '',
		component: 'test-component',
		field:     'test',
	} ) ).sortable ).toBe( true );

	// component columns that specify a representation should be sortable
	expect( ( new Column( {
		label: '',
		component:     'test-component',
		representedAs: () => 'test',
	} ) ).sortable ).toBe( true );

	// column with no field or representation should not be sortable
	expect( ( new Column( {label: '' } ) ).sortable ).toBe( false );

	// columns with a field should be sortable
	expect( ( new Column( {
		label: '',
		field: 'test',
	} ) ).sortable ).toBe( true );

	// columns with a representation should be sortable
	expect( ( new Column( {
		label: '',
		representedAs: () => 'test',
	} ) ).sortable ).toBe( true );

	// columns marked as unsortable should not be sortable
	expect( ( new Column( {
		label: '',
		field:    'test',
		sortable: false,
	} ) ).sortable ).toBe( false );
} );
describe( 'Is plain text field', () => {
	it.each`
field        | representedAs  | component     | expected
${undefined} | ${undefined}   | ${undefined}  | ${false}
${'foo'}     | ${undefined}   | ${undefined}  | ${true}
${'foo'}     | ${() => 'foo'} | ${undefined}  | ${true}
${'foo'}     | ${undefined}   | ${'foo'}      | ${true}
${'foo'}     | ${() => 'foo'} | ${'foo'}      | ${true}
${undefined} | ${() => 'foo'} | ${undefined}  | ${true}
${undefined} | ${() => 'foo'} | ${'foo'}      | ${true}
${undefined} | ${undefined}   | ${'foo'}      | ${false}`(
		'Field "$field", represented as "$representedAs", and component "$component" should be $expected',
		( { expected, ...colProps } ) => {
			expect( Column.isPlainTextField( colProps ) ).toBe( expected );
		} );
} );
describe( 'Check filterability', () => {
	it( 'Explicitly disable filterable', () => {
		const plainTextFieldMock = jest.spyOn( Column, 'isPlainTextField' ).mockImplementation();
		expect( Column.isFilterable( { label: '', filterable: false } ) ).toBe( false );
		expect( plainTextFieldMock ).not.toHaveBeenCalled();
	} );
	it.each( [true, undefined] )( 'Allow filterable by "%s" as `filterable` value', ( filterable: any ) => {
		const plainTextFieldMock = jest.spyOn( Column, 'isPlainTextField' ).mockImplementation( () => true );
		const obj = { label: '', filterable };
		expect( Column.isFilterable( obj ) ).toBe( true );
		expect( plainTextFieldMock ).toHaveBeenCalledTimes( 1 );
		expect( plainTextFieldMock ).toHaveBeenCalledWith( obj );
	} );
} );
describe( 'Check sortability', () => {
	it( 'Explicitly disable sortable', () => {
		const plainTextFieldMock = jest.spyOn( Column, 'isPlainTextField' ).mockImplementation();
		expect( Column.isSortable( { label: '', sortable: false } ) ).toBe( false );
		expect( plainTextFieldMock ).not.toHaveBeenCalled();
	} );
	it.each( [true, undefined] )( 'Allow sortable by "%s" as `sortable` value', ( sortable: any ) => {
		const plainTextFieldMock = jest.spyOn( Column, 'isPlainTextField' ).mockImplementation( () => true );
		const obj = { label: '', sortable };
		expect( Column.isSortable( obj ) ).toBe( true );
		expect( plainTextFieldMock ).toHaveBeenCalledTimes( 1 );
		expect( plainTextFieldMock ).toHaveBeenCalledWith( obj );
	} );
} );
it( 'Should accept any kind of data for `match`', () => {
	const col = new Column( { label: '' } );
	const mockGetRepresentation = jest.spyOn( col, 'getRepresentation' );

	mockGetRepresentation.mockReturnValue( '1' );
	expect( col.matches( { foo: 1 }, '1' ) ).toBe( true );
	mockGetRepresentation.mockReturnValue( '2' );
	expect( col.matches( { foo: 2 }, '1' ) ).toBe( false );
	mockGetRepresentation.mockReturnValue( 'azErty' );
	expect( col.matches( { foo: 'azErty' }, 'Aze' ) ).toBe( true );

	mockGetRepresentation.mockReturnValue( '1' );
	expect( col.matches( { foo: 1 }, '3' ) ).toBe( false );
	mockGetRepresentation.mockReturnValue( '2' );
	expect( col.matches( { foo: 2 }, '1' ) ).toBe( false );
	mockGetRepresentation.mockReturnValue( 'azerty' );
	expect( col.matches( { foo: 'azerty' }, 'qwe' ) ).toBe( false );
} );
