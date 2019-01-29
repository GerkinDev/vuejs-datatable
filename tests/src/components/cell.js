import Vue from 'vue';
import Column from '../../../src/classes/column.js';
import DatatableCell from '../../../src/vue-datatable-cell.vue';

const Ctor = Vue.extend(DatatableCell);

Vue.component('test-component', {
	props:    [ 'row' ],
	template: `
		<span>Test Component</span>
	`,
});

export default () => {
	it('displays field', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label: 'ID',
					field: 'user.id',
				}),
				row: {
					user: {
						id: 7,
					},
				},
			},
		}).$mount();

		expect(vm.$el.textContent.trim()).toBe('7');
	});

	it('displays representation', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label:         'ID',
					representedAs: row => `${ row.user.firstName  } ${  row.user.lastName }`,
				}),
				row: {
					user: {
						firstName: 'John',
						lastName:  'Doe',
					},
				},
			},
		}).$mount();

		expect(vm.$el.textContent.trim()).toBe('John Doe');
	});

	it('gives representation presidence over field', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label:         'ID',
					field:         'id',
					representedAs: row => `${ row.user.firstName  } ${  row.user.lastName }`,
				}),
				row: {
					id:   5,
					user: {
						firstName: 'Jack',
						lastName:  'Doe',
					},
				},
			},
		}).$mount();

		expect(vm.$el.textContent.trim()).toBe('Jack Doe');
	});

	it('displays component', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label:     'ID',
					component: 'test-component',
				}),
				row: {},
			},
		}).$mount();

		expect(vm.$el.textContent.trim()).toBe('Test Component');
	});

	it('gives component presidence', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label:         'ID',
					field:         'id',
					representedAs: row => row.user.firstName,
					component:     'test-component',
				}),
				row: {
					id:   6,
					user: {
						firstName: 'Jimmy',
					},
				},
			},
		}).$mount();

		expect(vm.$el.textContent.trim()).toBe('Test Component');
	});

	it('will show correct alignment', () => {
		const vm1 = new Ctor({
			propsData: {
				column: new Column({
					label: 'id',
					field: 'id',
				}),
				row: {
					id: 7,
				},
			},
		}).$mount();

		expect(vm1.$el.style.textAlign).toBe('left');

		const vmC = new Ctor({
			propsData: {
				column: new Column({
					label: 'id',
					field: 'id',
					align: 'center',
				}),
				row: {
					id: 7,
				},
			},
		}).$mount();

		expect(vmC.$el.style.textAlign).toBe('center');

		const vmR = new Ctor({
			propsData: {
				column: new Column({
					label: 'id',
					field: 'id',
					align: 'right',
				}),
				row: {
					id: 7,
				},
			},
		}).$mount();

		expect(vmR.$el.style.textAlign).toBe('right');
	});
};
