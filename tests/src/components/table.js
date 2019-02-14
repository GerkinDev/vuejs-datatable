import Vue from 'vue';
import DatatableFactory from '../../../src/classes/factory.js';

Vue.use(new DatatableFactory());

const Ctor = Vue.options.components.datatable;

Vue.component('test-component', {
	props:    [ 'row' ],
	template: `
		<span>Test Component</span>
	`,
});

export default () => {
	beforeEach(() => {
		window.Vue = Vue;
	});

	it('imports default settings', () => {
		const settings = (new Ctor({
			propsData: {
				columns: [],
				data:    [],
			},
		})).settings;

		expect(settings.get('table.class')).toBe('table table-hover table-striped');
	});

	it('returns the data via the rows method', () => {
		const vm = getTableElement();

		expect(vm.rows[0].id).toBe(1);
		expect(vm.rows[0].user.firstName).toBe('John');
		expect(vm.rows[0].user.lastName).toBe('Doe');

		expect(vm.rows[1].id).toBe(2);
		expect(vm.rows[1].user.firstName).toBe('Jane');
		expect(vm.rows[1].user.lastName).toBe('Doe');
	});

	it('normalizes the columns', () => {
		const vm = getTableElement();

		expect(vm.normalizedColumns[0].align).toBe('left');
		expect(vm.normalizedColumns[0].label).toBe('Field');
		expect(vm.normalizedColumns[0].field).toBe('id');
		expect(vm.normalizedColumns[0].representedAs).toBe(null);
		expect(vm.normalizedColumns[0].component).toBe(null);
		expect(vm.normalizedColumns[0].interpolate).toBe(false);
		expect(vm.normalizedColumns[0].sortable).toBe(true);
		expect(vm.normalizedColumns[0].filterable).toBe(true);

		expect(vm.normalizedColumns[1].align).toBe('left');
		expect(vm.normalizedColumns[1].label).toBe('Representation');
		expect(vm.normalizedColumns[1].field).toBe(null);
		expect(typeof vm.normalizedColumns[1].representedAs).toBe('function');
		expect(vm.normalizedColumns[1].component).toBe(null);
		expect(vm.normalizedColumns[1].interpolate).toBe(false);
		expect(vm.normalizedColumns[1].sortable).toBe(true);
		expect(vm.normalizedColumns[1].filterable).toBe(true);

		expect(vm.normalizedColumns[2].align).toBe('left');
		expect(vm.normalizedColumns[2].label).toBe('Component');
		expect(vm.normalizedColumns[2].field).toBe(null);
		expect(vm.normalizedColumns[2].representedAs).toBe(null);
		expect(vm.normalizedColumns[2].component).toBe('test-component');
		expect(vm.normalizedColumns[2].interpolate).toBe(false);
		expect(vm.normalizedColumns[2].sortable).toBe(false);
		expect(vm.normalizedColumns[2].filterable).toBe(false);
	});

	it('normalizes the columns', () => {
		const vm = getTableElement();

		expect(vm.tableClass).toBe('table table-hover table-striped');
	});

	it('determines if a column is being sorted by', () => {
		const vm = getTableElement(vm => {
			vm.sortDir = 'asc';
			vm.sortBy = vm.normalizedColumns[1];
		});

		expect(vm.getSortDirectionForColumn(vm.normalizedColumns[0])).toBe(null);
		expect(vm.getSortDirectionForColumn(vm.normalizedColumns[1])).toBe('asc');
		expect(vm.getSortDirectionForColumn(vm.normalizedColumns[2])).toBe(null);
	});

	it('can set column to b sorted by', () => {
		const vm = getTableElement(vm => {
			vm.setSortDirectionForColumn('desc', vm.normalizedColumns[2]);
		});

		expect(vm.sortBy).toBe(vm.normalizedColumns[2]);
		expect(vm.sortDir).toBe('desc');
	});

	it('builds expected base html', () => {
		const vm = getTableElement();

		expect(vm.$el.className).toBe('table table-hover table-striped');

		expect(vm.$el.querySelectorAll('thead th')[0].textContent.trim()).toBe('Field');
		expect(vm.$el.querySelectorAll('thead th')[1].textContent.trim()).toBe('Representation');
		expect(vm.$el.querySelectorAll('thead th')[2].textContent.trim()).toBe('Component');

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('1');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('John Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');

		expect(vm.$el.querySelectorAll('tbody tr td')[3].textContent.trim()).toBe('2');
		expect(vm.$el.querySelectorAll('tbody tr td')[4].textContent.trim()).toBe('Jane Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[5].textContent.trim()).toBe('Test Component');
	});

	it('can filter rows', () => {
		const vm = getTableElement(vm => {
			vm.filterBy = 'Jo do';
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('1');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('John Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');
	});

	it('can override filter logic', () => {
		const vm = getTableElement(vm => {
			vm.filterBy = 'Jo do';
			vm.handler.filterHandler = (rows, filterText) => rows.filter(row => {
				expect(filterText).toBe('Jo do');

				return row.id === 2;
			});
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('2');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('Jane Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');

		vm.handler.filterHandler = vm.handler.handleFilter;
	});

	it('will not filter component cells by default', () => {
		const vm = getTableElement(vm => {
			vm.filterBy = 'Test';
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(0);
	});

	it('will filter component cells when representedAs is defined', () => {
		const vm = getTableElement(vm =>{
			vm.filterBy = 'Test';
			vm.columns[2].representedAs = () =>'Test Component';
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(2);
	});

	it('can limit the number of rows displayed', () => {
		const vm = getTableElement(vm =>{
			vm.perPage = 1;
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('1');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('John Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');
	});

	it('can determine which page of rows to display', () => {
		const vm = getTableElement(vm =>{
			vm.perPage = 1;
			vm.page = 2;
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('2');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('Jane Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');
	});
};

function getTableElement(callback){
	const vm = new Ctor({
		propsData: {
			columns: [
				{
					label: 'Field',
					field: 'id',
				},
				{
					label:         'Representation',
					representedAs: row => `${ row.user.firstName  } ${  row.user.lastName }`,
				},
				{
					label:     'Component',
					component: 'test-component',
				},
			],
			data: [
				{
					id:   1,
					user: {
						firstName: 'John',
						lastName:  'Doe',
					},
				},
				{
					id:   2,
					user: {
						firstName: 'Jane',
						lastName:  'Doe',
					},
				},
			],
		},
	});

	if (callback && typeof callback === 'function'){
		callback(vm);
	}

	vm.$mount();

	return vm;
}
