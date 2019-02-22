import { createLocalVue } from '@vue/test-utils';
import DatatableFactory from './classes/factory.js';
import { waitForUpdate } from '../__tests__/helpers/utils';

const localVue = createLocalVue();
localVue.use(new DatatableFactory());

// Vue.component('datatable-button', DatatablePagerButton);
//
// DatatablePager.settings = new Settings;
// const Ctor = Vue.extend(DatatablePager);
const DtCtor = localVue.options.components['datatable'];
const Ctor = localVue.options.components['datatable-pager'];

function setupVue(propsData?: object, callback?: Function){
	if (!propsData){
		propsData = {};
	}

	window.vim = new DtCtor({propsData: propsData});

	if (typeof callback === 'function'){
		callback(window.vim);
	}

	window.vim.$mount();

	return window.vim;
}

afterEach(() => {
	if (window.vm){
		window.vm.$destroy(true);
	}

	if (localVue.$datatables.default){
		localVue.$datatables.default = null;
	}
});

it('builds base HTML for long type', done => {
	const dt = setupVue({
		data:    [{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}],
		columns: [{
			'label': 'ID',
			field:   'id',
		}],
	});

	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.$el.nodeName).toBe('NAV');
	expect(vm.$el.textContent).toBe('12');
	expect(vm.$el.children.length).toBe(1);
	expect(vm.$el.children[0].nodeName).toBe('UL');
	expect(vm.$el.children[0].children.length).toBe(2);

	vm.type = 'short';

	waitForUpdate(() => {
		expect(vm.$el.nodeName).toBe('NAV');
		expect(vm.$el.textContent).toBe('< 1 >');
		expect(vm.$el.children.length).toBe(1);
		expect(vm.$el.children[0].nodeName).toBe('UL');
		expect(vm.$el.children[0].children.length).toBe(3);

		vm.type = 'abbreviated';
		dt.data = [
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
			{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1},
		];
	}).then(() => {
		expect(vm.$el.nodeName).toBe('NAV');
		expect(vm.$el.textContent.trim()).toBe('1 2 3 ... 10');
		expect(vm.$el.children.length).toBe(1);
		expect(vm.$el.children[0].nodeName).toBe('UL');
		expect(vm.$el.children[0].children.length).toBe(5);

		vm.page = 5;
	}).then(() => {
		expect(vm.$el.textContent.trim()).toBe('1 ... 3 4 5 6 7 ... 10');
	}).then(done);
});

it('returns the correct pagination class', () => {
	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.paginationClass).toBe('pagination');
});

it('returns the correct disabled class', () => {
	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.disabledClass).toBe('disabled');
});

it('returns the correct next link classes', () => {
	setupVue({
		data:    [{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}],
		columns: [{
			'label': 'ID',
			field:   'id',
		}],
	});

	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.nextLinkClasses).toBe('');

	const vm2 = (new Ctor({
		propsData: {
			perPage: 15,
		},
	})).$mount();

	expect(vm2.nextLinkClasses).toBe('disabled');
});

it('returns the correct previous link classes', () => {
	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.previousLinkClasses).toBe('disabled');

	const vm2 = (new Ctor({
		propsData: {
			perPage: 2,
		},
	})).$mount();

	expect(vm2.previousLinkClasses).toBe('disabled');

	const vm3 = (new Ctor({
		propsData: {
			perPage: 2,
			page:    2,
		},
	})).$mount();

	expect(vm3.previousLinkClasses).toBe('');
});

it('returns the correct total number of pages', () => {
	setupVue({
		data:    [{id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}],
		columns: [{
			'label': 'ID',
			field:   'id',
		}],
	});

	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.totalPages).toBe(2);

	const vm2 = (new Ctor({
		propsData: {
			perPage: 2,
		},
	})).$mount();

	expect(vm2.totalPages).toBe(8);

	const vm3 = (new Ctor({
		propsData: {
			perPage: 5,
		},
	})).$mount();

	expect(vm3.totalPages).toBe(3);
});

it('returns the correct next icon', () => {
	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.nextIcon).toBe('&gt;');
});

it('returns the correct previous icon', () => {
	const vm = (new Ctor({
		propsData: {},
	})).$mount();

	expect(vm.previousIcon).toBe('&lt;');
});

it('returns the correct page class', () => {
	const vm = (new Ctor({
		propsData: {
			perPage: 2,
		},
	})).$mount();

	expect(vm.getClassForPage(1)).toBe('active');

	const vm2 = (new Ctor({
		propsData: {
			perPage: 2,
			page:    2,
		},
	})).$mount();

	expect(vm2.getClassForPage(1)).toBe('');
});

it('properly adjusts the selected page when total pages changes', done => {
	setupVue({
		data:    [{id: 4}, {id: 4}, {id: 4}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}, {id: 1}],
		columns: [{
			'label': 'ID',
			field:   'id',
		}],
	});

	const vm = (new Ctor({
		propsData: {
			page:    5,
			perPage: 2,
		},
	})).$mount();

	expect(vm.page).toBe(5);
	const spy = jasmine.createSpy('changeCallback');

	vm.$on('change', spy);

	vm.tableInstance.filterBy = '4';

	waitForUpdate(() => {
		expect(spy).toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(2);
	}).then(done);
});
