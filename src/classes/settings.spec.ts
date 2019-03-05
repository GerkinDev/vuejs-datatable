import Settings from './settings';

it( 'can retrieve properties', () => {
	const settings = new Settings();

	expect( settings.get( 'table.class' ) ).toBe( 'table table-hover table-striped' );
} );

it( 'can set properties', () => {
	const settings = new Settings();
	settings.set( 'table.class', 'test-table' );

	expect( settings.get( 'table.class' ) ).toBe( 'test-table' );
} );

describe( 'Settings merging', () => {
	it( 'Should override existing props', () => {
		const settings = new Settings();
		settings.merge( {
			pager: {
				classes: {
					selected: 'active',
				},
			},
			table: {
				class: 'table class',
			},
		} );

		expect( settings.get( 'table.class' ) ).toBe( 'table class' );
		expect( settings.get( 'table.sorting.sortAsc' ) ).toBe( '↓' );
		expect( settings.get( 'pager.classes.selected' ) ).toBe( 'active' );
		expect( settings.get( 'pager.classes.disabled' ) ).toBe( 'disabled' );
		expect( settings.get( 'pager.icons.previous' ) ).toBe( '&lt;' );
	} );
	it( 'Should merge new props', () => {
		const settings = new Settings();
		settings.merge( {
			foo: {
				bar: 'baz',
			},
		} );

		expect( settings.get( 'foo.bar' ) ).toBe( 'baz' );
		expect( settings.get( 'table.sorting.sortAsc' ) ).toBe( '↓' );
	} );
} );
