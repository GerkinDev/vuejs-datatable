jest.mock('./classes/column');
import { createLocalVue, mount } from '@vue/test-utils';
import Column, { getRepresentation } from './classes/column.js';
import DatatableCell from './vue-datatable-cell.vue';

const localVue = createLocalVue();

const TestComponent = {
	props:  [ 'row', 'column' ],
	render: (c) => c('')
};
localVue.component('test-component', TestComponent);

it('displays column representation', () => {
	getRepresentation.mockReturnValue('retRepresentation');
	const col = new Column({});
	const row = {};
	const wrapper = mount(DatatableCell, {
		propsData: { column: col, row },
		localVue
	});

	expect(wrapper.element.textContent.trim()).toBe('retRepresentation');
	expect(getRepresentation).toHaveBeenCalledTimes(1);
	expect(getRepresentation).toHaveBeenCalledWith(row);
});

it('displays component', () => {
	const col = new Column({ component: 'test-component' });
	const row = {};
	const wrapper = mount(DatatableCell, {
		propsData: { column: col, row: row },
		localVue
	});

	expect(wrapper.contains(TestComponent)).toBe(true);
	const mountedTestComponent = wrapper.find(TestComponent);
	expect(mountedTestComponent.props().row).toBe(row);
	expect(mountedTestComponent.props().column).toBe(col);
});
it('can change text alignment', () => {
	const wrapperL = mount(DatatableCell, {
		propsData: { column: new Column({ align: 'left' }), row: {} }
	});
	expect(wrapperL.element.style.textAlign).toBe('left');

	const wrapperC = mount(DatatableCell, {
		propsData: { column: new Column({ align: 'center' }), row: {} }
	});
	expect(wrapperC.element.style.textAlign).toBe('center');

	const wrapperR = mount(DatatableCell, {
		propsData: { column: new Column({ align: 'right' }), row: {} }
	});
	expect(wrapperR.element.style.textAlign).toBe('right');
});
