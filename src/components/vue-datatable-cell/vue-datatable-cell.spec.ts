// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue, mount } from '@vue/test-utils';

jest.mock( '../../classes/column' );
import { Column, getRepresentation } from '../../classes/column';
import { VueDatatableCell } from './vue-datatable-cell';

const localVue = createLocalVue();

const TestComponent = {
	name: 'test-component',
	props:  [ 'row', 'column' ],
	render: c => c( '' ),
};
localVue.component( TestComponent.name, TestComponent );

beforeEach( () => {
	jest.clearAllMocks();
} );
describe( 'Display values', () => {
	it( 'Should display the column representation with interpolation', () => {
		getRepresentation.mockReturnValue( '<p>retRepresentation</p>' );
		const col = new Column( { interpolate: true } );
		const row = {};
		const wrapper = mount( VueDatatableCell, {
			localVue,
			propsData: { column: col, row },
		} );

		expect( wrapper.element ).toBeInstanceOf( HTMLTableCellElement );
		expect( wrapper.element.innerHTML.trim() ).toBe( '<p>retRepresentation</p>' );
		expect( getRepresentation ).toHaveBeenCalledTimes( 1 );
		expect( getRepresentation ).toHaveBeenCalledWith( row );
	} );

	it( 'Should display the column representation without interpolation', () => {
		getRepresentation.mockReturnValue( '<p>retRepresentation</p>' );
		const col = new Column( { interpolate: false } );
		const row = {};
		const wrapper = mount( VueDatatableCell, {
			localVue,
			propsData: { column: col, row },
		} );

		expect( wrapper.element ).toBeInstanceOf( HTMLTableCellElement );
		expect( wrapper.element.innerHTML.trim() ).toBe( '&lt;p&gt;retRepresentation&lt;/p&gt;' );
		expect( getRepresentation ).toHaveBeenCalledTimes( 1 );
		expect( getRepresentation ).toHaveBeenCalledWith( row );
	} );

	it( 'Should display the component', () => {
		const col = new Column( { component: 'test-component' } );
		const row = {};
		const wrapper = mount( VueDatatableCell, {
			localVue,
			propsData: { column: col, row },
		} );

		expect( wrapper.element ).toBeInstanceOf( HTMLTableCellElement );
		expect( wrapper.contains( TestComponent ) ).toBe( true );
		const mountedTestComponent = wrapper.find( TestComponent );
		expect( mountedTestComponent.props().row ).toBe( row );
		expect( mountedTestComponent.props().column ).toBe( col );
	} );
} );
it( 'can change text alignment', () => {
	const wrapperL = mount( VueDatatableCell, {
		propsData: { column: new Column( { align: 'left' } ), row: {} },
	} );
	expect( wrapperL.element.style.textAlign ).toBe( 'left' );

	const wrapperC = mount( VueDatatableCell, {
		propsData: { column: new Column( { align: 'center' } ), row: {} },
	} );
	expect( wrapperC.element.style.textAlign ).toBe( 'center' );

	const wrapperR = mount( VueDatatableCell, {
		propsData: { column: new Column( { align: 'right' } ), row: {} },
	} );
	expect( wrapperR.element.style.textAlign ).toBe( 'right' );
} );
