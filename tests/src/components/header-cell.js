import Vue from 'vue';
import Column from '../../../src/classes/column.js';
import Settings from '../../../src/classes/settings.js';
import DatatableHeader from '../../../src/vue-datatable-header.vue';

const Ctor = Vue.extend(DatatableHeader);

const settings = new Settings();

export default () => {
	it('builds expected base html', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label: 'Column Label',
				}),
				settings: settings,
			},
		}).$mount();

		expect(vm.$el.style.textAlign).toBe('left');
		expect(vm.$el.textContent.trim()).toBe('Column Label');
		expect(vm.$el.children.length).toBe(0);
	});

	it('can change text alignment', () => {
		const mvC = new Ctor({
			propsData: {
				column: new Column({
					label: 'Column Label',
					align: 'center',
				}),
				settings: settings,
			},
		}).$mount();

		expect(mvC.$el.style.textAlign).toBe('center');

		const vmR = new Ctor({
			propsData: {
				column: new Column({
					label: 'Column Label',
					align: 'right',
				}),
				settings: settings,
			},
		}).$mount();

		expect(vmR.$el.style.textAlign).toBe('right');
	});

	it('will hide non-sortability', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label: 'Column Label',
				}),
				settings: settings,
			},
		}).$mount();

		expect(vm.$el.children.length).toBe(0);

		const vm2 = new Ctor({
			propsData: {
				column: new Column({
					label:         'Column Label',
					representedAs: () =>'',
					sortable:      false,
				}),
				settings: settings,
			},
		}).$mount();

		expect(vm2.$el.children.length).toBe(0);
	});

	it('will display sortability', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label:         'Column Label',
					representedAs: () => '',
				}),
				settings: settings,
			},
		}).$mount();

		expect(vm.$el.children.length).toBe(1);
		expect(vm.$el.children[0].nodeName).toBe('SPAN');
		expect(vm.$el.children[0].className).toBe('sort glyphicon glyphicon-sort');
	});

	it('will use correct classes for sort display', () => {
		const vm = new Ctor({
			propsData: {
				column: new Column({
					label:         'Column Label',
					representedAs: () => '',
				}),
				settings: settings,
			},
		}).$mount();

		expect(vm.canSort).toBe(true);
		expect(vm.isSorted).toBe(false);
		expect(vm.isSortedAscending).toBe(false);
		expect(vm.isSortedDescending).toBe(false);
		expect(vm.classes).toBe('sort glyphicon glyphicon-sort');

		vm.direction = 'asc';
		expect(vm.canSort).toBe(true);
		expect(vm.isSorted).toBe(true);
		expect(vm.isSortedAscending).toBe(true);
		expect(vm.isSortedDescending).toBe(false);
		expect(vm.classes).toBe('sort glyphicon glyphicon-sort-by-alphabet');

		vm.direction = 'desc';
		expect(vm.canSort).toBe(true);
		expect(vm.isSorted).toBe(true);
		expect(vm.isSortedAscending).toBe(false);
		expect(vm.isSortedDescending).toBe(true);
		expect(vm.classes).toBe('sort glyphicon glyphicon-sort-by-alphabet-alt');

		vm.direction = null;
		expect(vm.canSort).toBe(true);
		expect(vm.isSorted).toBe(false);
		expect(vm.isSortedAscending).toBe(false);
		expect(vm.isSortedDescending).toBe(false);
		expect(vm.classes).toBe('sort glyphicon glyphicon-sort');
	});
};
