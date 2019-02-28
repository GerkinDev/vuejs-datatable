import { createLocalVue, mount } from '@vue/test-utils';
import Column from './classes/column.js';
import DatatableCell from './vue-datatable-cell.vue';

const localVue = createLocalVue();
const Ctor = localVue.extend(DatatableCell);

localVue.component('test-component', {
	props:    [ 'row' ],
	render: c => c('span', 'Test Component')
});

it('displays field', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'ID',
				field: 'user.id'
			}),
			row: {
				user: {
					id: 7
				}
			}
		},
		localVue
	});

	expect(wrapper.element.textContent.trim()).toBe('7');
});

it('displays representation', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			column: new Column({
				label:         'ID',
				representedAs: row => `${ row.user.firstName } ${ row.user.lastName }`
			}),
			row: {
				user: {
					firstName: 'John',
					lastName:  'Doe'
				}
			}
		},
		localVue
	});

	expect(wrapper.element.textContent.trim()).toBe('John Doe');
});

it('gives representation presidence over field', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			column: new Column({
				label:         'ID',
				field:         'id',
				representedAs: row => `${ row.user.firstName } ${ row.user.lastName }`
			}),
			row: {
				id:   5,
				user: {
					firstName: 'Jack',
					lastName:  'Doe'
				}
			}
		},
		localVue
	});

	expect(wrapper.element.textContent.trim()).toBe('Jack Doe');
});

it('displays component', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			column: new Column({
				label:     'ID',
				component: 'test-component'
			}),
			row: {}
		},
		localVue
	});

	expect(wrapper.element.textContent.trim()).toBe('Test Component');
});

it('gives component presidence', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			column: new Column({
				label:         'ID',
				field:         'id',
				representedAs: row => row.user.firstName,
				component:     'test-component'
			}),
			row: {
				id:   6,
				user: {
					firstName: 'Jimmy'
				}
			}
		}
	});

	expect(wrapper.element.textContent.trim()).toBe('Test Component');
});

it('will show correct alignment', () => {
	const wrapper1 = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'id',
				field: 'id'
			}),
			row: {
				id: 7
			}
		}
	});

	expect(wrapper1.element.style.textAlign).toBe('left');

	const wrapperC = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'id',
				field: 'id',
				align: 'center'
			}),
			row: {
				id: 7
			}
		}
	});

	expect(wrapperC.element.style.textAlign).toBe('center');

	const wrapperR = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'id',
				field: 'id',
				align: 'right'
			}),
			row: {
				id: 7
			}
		}
	});

	expect(wrapperR.element.style.textAlign).toBe('right');
});
