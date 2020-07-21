import Vue from 'vue';

import '../../../tutorials/assets/rows';
import { IPeople } from '../../../tutorials/src/utils';

declare const rows: IPeople[];

describe( 'Basic table', () => {
	const appId = '#demo-app';

	it( 'Row format should be respected', () => {
		cy.visit( '__tests__/e2e/mocks/simple.html' );

		// Test initial state
		cy.get( appId + ' table tbody tr:nth-child(1)' ).within( () => {
			cy.get( 'td:nth-child(1)' ).contains( '1' );
			cy.get( 'td:nth-child(2)' ).contains( 'dprice0@blogs.com' );
			cy.get( 'td:nth-child(3)' ).contains( '3 Toban Park, Pocatello, Idaho' );
		} );
	} );
	it( 'Pagination should work with default values', () => {
		cy.visit( '__tests__/e2e/mocks/simple.html' );

		// Test initial state
		cy.get( appId + ' table tbody' )
			.children()
			.should( 'have.length', 25 )

			.get( appId + ' table tbody tr:nth-child(1) td:first-child' )
			.contains( '1' )

			.get( appId + ' table + nav ul' )
			.children()
			.should( 'have.length', 4 )

			.get( appId + ' table + nav ul li:nth-child(1)' )
			.should( 'have.class', 'active' );

		// Change page
		cy.get( appId + ' table + nav ul li:nth-child(2)' )
			.click();

		// Check new state
		cy.get( appId + ' table tbody' )
			.children()
			.should( 'have.length', 25 )

			.get( appId + ' table tbody tr:nth-child(1) td:first-child' )
			.contains( '26' )

			.get( appId + ' table + nav ul li:nth-child(1)' )
			.should( 'not.have.class', 'active' )

			.get( appId + ' table + nav ul li:nth-child(2)' )
			.should( 'have.class', 'active' );
	} );
	it( 'Filtering should hide unmatched elements', () => {
		cy.visit( '__tests__/e2e/mocks/simple.html' );

		// Type some filter
		cy.get( '#filter' )
			.type( 'cs' );

		cy.get( appId + ' table tbody' )
			.children()
			.should( 'have.length', 6 )

			.get( `${appId} table tbody tr` )
			.each( e => {
				cy.wrap( e ).should( 'contain.html', 'cs' );
			} );

		cy.get( appId + ' table + nav ul' )
			.children()
			.should( 'have.length', 1 );
	} );
	describe( 'Sorting', () => {
		it( 'should reorder text elements in ascending order', () => {
			cy.visit( '__tests__/e2e/mocks/simple.html' );
			let prevCellVal: string | undefined;

			// Change sort
			cy.get( 'th:nth-child(2)' )
				.click();

			cy.get( appId + ' table tbody' )
				.children()
				.each( row => {
					const cell = row.children()[1];
					const cellVal = cell.innerHTML.trim();
					if ( prevCellVal ) {
						cy.wrap( cellVal.localeCompare( prevCellVal ) ).should( 'be.above', 0 );
					}
					prevCellVal = cellVal;
				} ).then( () => {
					prevCellVal = undefined;
				} );
		} );
		it( 'should reorder text elements in descending order', () => {
			cy.visit( '__tests__/e2e/mocks/simple.html' );
			let prevCellVal: string | undefined;

			// Change sort
			cy.get( 'th:nth-child(2)' )
				.click()
				.click();

			cy.get( appId + ' table tbody' )
				.children()
				.each( row => {
					const cell = row.children()[1];
					const cellVal = cell.innerHTML.trim();
					if ( prevCellVal ) {
						cy.wrap( cellVal.localeCompare( prevCellVal ) ).should( 'be.below', 0 );
					}
					prevCellVal = cellVal;
				} ).then( () => {
					prevCellVal = undefined;
				} );
		} );
		it( 'should reorder text elements in base order', () => {
			cy.visit( '__tests__/e2e/mocks/simple.html' );
			let prevRowId: number | undefined;

			// Change sort
			cy.get( 'th:nth-child(2)' )
				.click()
				.click()
				.click();

			cy.get( appId + ' table tbody' )
				.children()
				.each( row => {
					const cell = row.children()[0];
					const rowId = parseInt( cell.innerHTML.trim(), 10 );
					if ( prevRowId ) {
						cy.wrap( rowId ).should( 'be.above', prevRowId );
					}
					prevRowId = rowId;
				} ).then( () => {
					prevRowId = undefined;
				} );
		} );
	} )
} );
