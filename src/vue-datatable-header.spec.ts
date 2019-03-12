// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';

jest.mock( './classes/column' );
jest.mock( './classes/settings' );
import Column from './classes/column.js';
import Settings, { get } from './classes/settings.js';
import DatatableHeader from './vue-datatable-header.vue';

const localVue = createLocalVue();

const settings = new Settings();

it( 'builds expected base html', () => {
	const wrapper = mount( DatatableHeader, {
		propsData: {
			column: new Column( {
				label: 'Column Label',
			} ),
			settings,
		},
	} );

	expect( wrapper.element.children.length ).toBe( 1 );
	expect( wrapper.element.children[0] ).toBeInstanceOf( HTMLSpanElement );
	expect( wrapper.element.children[0].innerHTML.trim() ).toBe( 'Column Label' );
} );

it( 'can change text alignment', () => {
	const wrapperL = mount( DatatableHeader, {
		propsData: {
			column: new Column( { headerAlign: 'left' } ),
			settings,
		},
	} );
	expect( wrapperL.element.style.textAlign ).toBe( 'left' );

	const wrapperC = mount( DatatableHeader, {
		propsData: {
			column: new Column( { headerAlign: 'center' } ),
			settings,
		},
	} );
	expect( wrapperC.element.style.textAlign ).toBe( 'center' );

	const wrapperR = mount( DatatableHeader, {
		propsData: {
			column: new Column( { headerAlign: 'right' } ),
			settings,
		},
	} );
	expect( wrapperR.element.style.textAlign ).toBe( 'right' );
} );

it( 'Should show/hide the sort HTML', () => {
	get.mockReturnValue( {
		sortAsc: '<button>ASC</button>',
		sortDesc: '<button>DESC</button>',
		sortNone: '<button>NONE</button>',
	} );
	const col = new Column( {} );
	col.sortable = true;
	const wrapper1 = mount( DatatableHeader, {
		propsData: {
			column: col,
			settings,
		},
	} );
	expect( wrapper1.element.children.length ).toBe( 2 );
	expect( wrapper1.element.children[0] ).toBeInstanceOf( HTMLSpanElement );
	expect( get ).toHaveBeenCalledWith( 'table.sorting' );
	expect( wrapper1.element.children[1] ).toBeInstanceOf( HTMLSpanElement );
	expect( wrapper1.element.children[1].innerHTML ).toBe( '<button>NONE</button>' );

	col.sortable = false;
	const wrapper2 = mount( DatatableHeader, {
		propsData: {
			column: col,
			settings,
		},
	} );
	expect( wrapper2.element.children.length ).toBe( 1 );
	expect( wrapper2.element.children[0] ).toBeInstanceOf( HTMLSpanElement );
} );

it( 'Should get the correct sort HTML', () => {
	get.mockReturnValue( {
		sortAsc: '<button>ASC</button>',
		sortDesc: '<button>DESC</button>',
		sortNone: '<button>NONE</button>',
	} );
	const col = new Column( {} );
	const wrapper = mount<any>( DatatableHeader, {
		propsData: {
			column: col,
			settings,
		},
	} );

	wrapper.setProps( { direction: 'asc' } );
	expect( wrapper.vm.sortButtonHtml ).toBe( '<button>ASC</button>' );
	wrapper.setProps( { direction: 'desc' } );
	expect( wrapper.vm.sortButtonHtml ).toBe( '<button>DESC</button>' );
	wrapper.setProps( { direction: null } );
	expect( wrapper.vm.sortButtonHtml ).toBe( '<button>NONE</button>' );
} );

it( 'Should cycle correctly between sort states', () => {
	const col = new Column( {} );
	col.sortable = false;
	const wrapper = mount<any>( DatatableHeader, {
		propsData: {
			column: col,
			settings,
		},
	} );

	wrapper.vm.toggleSort();
	expect( wrapper.emitted().change ).toBeFalsy();
	Object.defineProperty( wrapper.vm, 'canSort', { value: true } );
	wrapper.vm.toggleSort();
	expect( wrapper.emitted().change ).toHaveLength( 1 );
	expect( wrapper.emitted().change[0][0] ).toBe( 'asc' );
	expect( wrapper.emitted().change[0][1] ).toBe( col );
	wrapper.setProps( { direction: 'asc' } );
	wrapper.vm.toggleSort();
	expect( wrapper.emitted().change ).toHaveLength( 2 );
	expect( wrapper.emitted().change[1][0] ).toBe( 'desc' );
	expect( wrapper.emitted().change[1][1] ).toBe( col );
	wrapper.setProps( { direction: 'desc' } );
	wrapper.vm.toggleSort();
	expect( wrapper.emitted().change ).toHaveLength( 3 );
	expect( wrapper.emitted().change[2][0] ).toBe( null );
	expect( wrapper.emitted().change[2][1] ).toBe( col );
	wrapper.setProps( { direction: null } );
	wrapper.vm.toggleSort();
	expect( wrapper.emitted().change ).toHaveLength( 4 );
	expect( wrapper.emitted().change[3][0] ).toBe( 'asc' );
	expect( wrapper.emitted().change[3][1] ).toBe( col );
} );
