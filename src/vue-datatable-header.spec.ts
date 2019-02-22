import { createLocalVue, mount } from '@vue/test-utils';
import Column from './classes/column.js';
import Settings from './classes/settings.js';
import DatatableHeader from './vue-datatable-header.vue';

const localVue = createLocalVue();
const Ctor = localVue.extend(DatatableHeader);

const settings = new Settings();

it('builds expected base html', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'Column Label',
			}),
			settings: settings,
		},
	});

	expect(wrapper.element.style.textAlign).toBe('left');
	expect(wrapper.element.children.length).toBe(1);
	expect(wrapper.element.children[0]).toBeInstanceOf(HTMLSpanElement);
	expect(wrapper.element.children[0].innerHTML.trim()).toBe('Column Label');
});

it('can change text alignment', () => {
	const wrapperC = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'Column Label',
				align: 'center',
			}),
			settings: settings,
		},
	});

	expect(wrapperC.element.style.textAlign).toBe('center');

	const wrapperR = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'Column Label',
				align: 'right',
			}),
			settings: settings,
		},
	});

	expect(wrapperR.element.style.textAlign).toBe('right');
});

it('will hide non-sortability', () => {
	const wrapper1 = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'Column Label',
			}),
			settings: settings,
		},
	});

	expect(wrapper1.element.children.length).toBe(1);
	expect(wrapper1.element.children[0]).toBeInstanceOf(HTMLSpanElement);
	expect(wrapper1.element.children[0].innerHTML.trim()).toBe('Column Label');

	const wrapper2 = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'Column Label',
				representedAs: () =>'',
				sortable:      false,
			}),
			settings: settings,
		},
	});
	expect(wrapper2.element.children.length).toBe(1);
	expect(wrapper2.element.children[0]).toBeInstanceOf(HTMLSpanElement);
	expect(wrapper2.element.children[0].innerHTML.trim()).toBe('Column Label');
});

it('will display sortability', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			column: new Column({
				label: 'Column Label',
				representedAs: () => '',
			}),
			settings: settings,
		},
	});

	expect(wrapper.element.children.length).toBe(2);
	expect(wrapper.element.children[0]).toBeInstanceOf(HTMLSpanElement);
	expect(wrapper.element.children[0].innerHTML.trim()).toBe('Column Label');
	expect(wrapper.element.children[1]).toBeInstanceOf(HTMLSpanElement);
	expect(wrapper.element.children[1].className).toBe('sort glyphicon glyphicon-sort');
});

it('will use correct classes for sort display', () => {
	const wrapper = mount<any>(Ctor, {
		propsData: {
			column: new Column({
				label: 'Column Label',
				representedAs: () => '',
			}),
			settings: settings,
		},
	});

	expect(wrapper.vm.canSort).toBe(true);
	expect(wrapper.vm.isSorted).toBe(false);
	expect(wrapper.vm.isSortedAscending).toBe(false);
	expect(wrapper.vm.isSortedDescending).toBe(false);
	expect(wrapper.vm.classes).toBe('sort glyphicon glyphicon-sort');

	wrapper.setProps({ direction: 'asc' });
	expect(wrapper.vm.canSort).toBe(true);
	expect(wrapper.vm.isSorted).toBe(true);
	expect(wrapper.vm.isSortedAscending).toBe(true);
	expect(wrapper.vm.isSortedDescending).toBe(false);
	expect(wrapper.vm.classes).toBe('sort glyphicon glyphicon-sort-by-alphabet');

	wrapper.setProps({ direction: 'desc' });
	expect(wrapper.vm.canSort).toBe(true);
	expect(wrapper.vm.isSorted).toBe(true);
	expect(wrapper.vm.isSortedAscending).toBe(false);
	expect(wrapper.vm.isSortedDescending).toBe(true);
	expect(wrapper.vm.classes).toBe('sort glyphicon glyphicon-sort-by-alphabet-alt');

	wrapper.setProps({ direction: null });
	expect(wrapper.vm.canSort).toBe(true);
	expect(wrapper.vm.isSorted).toBe(false);
	expect(wrapper.vm.isSortedAscending).toBe(false);
	expect(wrapper.vm.isSortedDescending).toBe(false);
	expect(wrapper.vm.classes).toBe('sort glyphicon glyphicon-sort');
});
