// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';

jest.mock( '../../classes/column' );
jest.mock( '../../classes/table-type' );
import { Column } from '../../classes/column';
// @ts-ignore
import { setting, TableType } from '../../classes/table-type';
import { EColAlign } from '../../utils';
import { VueDatatableHeader } from './vue-datatable-header';

const localVue = createLocalVue();

it( 'builds expected base html', () => {
	const wrapper = mount( VueDatatableHeader, {
		propsData: { column: new Column<any>( { label: 'Column Label' } ) },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
	} );

	expect( wrapper.element.children.length ).toBe( 1 );
	expect( wrapper.element.children[0] ).toBeInstanceOf( HTMLSpanElement );
	expect( wrapper.element.children[0].innerHTML.trim() ).toBe( 'Column Label' );
} );

it( 'can change text alignment', () => {
	const wrapperL = mount( VueDatatableHeader, {
		propsData: { column: new Column<any>( { label: '', headerAlign: EColAlign.Left } ) },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
	} );
	expect( wrapperL.element.style.textAlign ).toBe( 'left' );

	const wrapperC = mount( VueDatatableHeader, {
		propsData: { column: new Column<any>( { label: '', headerAlign: EColAlign.Center } ) },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
	} );
	expect( wrapperC.element.style.textAlign ).toBe( 'center' );

	const wrapperR = mount( VueDatatableHeader, {
		propsData: { column: new Column<any>( { label: '', headerAlign: EColAlign.Right } ) },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
	} );
	expect( wrapperR.element.style.textAlign ).toBe( 'right' );
} );

it( 'Should show/hide the sort HTML', () => {
	setting.mockReturnValue( {
		sortAsc: '<button>ASC</button>',
		sortDesc: '<button>DESC</button>',
		sortNone: '<button>NONE</button>',
	} );
	const col = new Column<any>( { label: '' } );
	col.sortable = true;
	const wrapper1 = mount( VueDatatableHeader, {
		propsData: { column: col },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
	} );
	expect( wrapper1.element.children.length ).toBe( 2 );
	expect( wrapper1.element.children[0] ).toBeInstanceOf( HTMLSpanElement );
	expect( setting ).toHaveBeenCalledWith( 'table.sorting' );
	expect( wrapper1.element.children[1] ).toBeInstanceOf( HTMLSpanElement );
	expect( wrapper1.element.children[1].innerHTML ).toBe( '<button>NONE</button>' );

	col.sortable = false;
	const wrapper2 = mount( VueDatatableHeader, {
		propsData: { column: col },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
	} );
	expect( wrapper2.element.children.length ).toBe( 1 );
	expect( wrapper2.element.children[0] ).toBeInstanceOf( HTMLSpanElement );
} );

it( 'Should get the correct sort HTML', () => {
	setting.mockReturnValue( {
		sortAsc: '<button>ASC</button>',
		sortDesc: '<button>DESC</button>',
		sortNone: '<button>NONE</button>',
	} );
	const col = new Column<any>( { label: '' } );
	const wrapper = mount<any>( VueDatatableHeader, {
		propsData: { column: col },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
	} );

	wrapper.setProps( { direction: 'asc' } );
	expect( wrapper.vm.sortButtonHtml ).toBe( '<button>ASC</button>' );
	wrapper.setProps( { direction: 'desc' } );
	expect( wrapper.vm.sortButtonHtml ).toBe( '<button>DESC</button>' );
	wrapper.setProps( { direction: null } );
	expect( wrapper.vm.sortButtonHtml ).toBe( '<button>NONE</button>' );
} );

it( 'Should cycle correctly between sort states', () => {
	const col = new Column<any>( { label: '' } );
	col.sortable = false;
	const wrapper = mount<any>( VueDatatableHeader, {
		propsData: { column: col },
		provide: { 'table-type': new TableType<any>( 'tmp' ) },
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
