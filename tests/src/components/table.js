import Vue from 'vue';
import DatatableFactory from '../../../src/classes/factory.js';

Vue.use((new DatatableFactory));

const Ctor = Vue.options.components.datatable;

Vue.component('test-component', {
	template: `
		<span>Test Component</span>
	`,
	props: ['row']
});

export default () => {
	beforeEach(function(){
		window.Vue = Vue;
	});

    it('imports default settings', () => {
        const settings = (new Ctor({propsData: {columns: [], data: []}})).settings;

        expect(settings.get('table.class')).toBe('table table-hover table-striped');
    });

	it('returns the data via the rows method', () => {
		const vm = getTableElement();

		expect(vm.rows[0].id).toBe(1);
		expect(vm.rows[0].user.first_name).toBe('John');
		expect(vm.rows[0].user.last_name).toBe('Doe');

		expect(vm.rows[1].id).toBe(2);
		expect(vm.rows[1].user.first_name).toBe('Jane');
		expect(vm.rows[1].user.last_name).toBe('Doe');
	});

	it('normalizes the columns', () => {
		const vm = getTableElement();

		expect(vm.normalized_columns[0].align).toBe('left');
		expect(vm.normalized_columns[0].label).toBe('Field');
		expect(vm.normalized_columns[0].field).toBe('id');
		expect(vm.normalized_columns[0].representedAs).toBe(null);
		expect(vm.normalized_columns[0].component).toBe(null);
		expect(vm.normalized_columns[0].interpolate).toBe(false);
		expect(vm.normalized_columns[0].sortable).toBe(true);
		expect(vm.normalized_columns[0].filterable).toBe(true);

		expect(vm.normalized_columns[1].align).toBe('left');
		expect(vm.normalized_columns[1].label).toBe('Representation');
		expect(vm.normalized_columns[1].field).toBe(null);
		expect(typeof vm.normalized_columns[1].representedAs).toBe('function');
		expect(vm.normalized_columns[1].component).toBe(null);
		expect(vm.normalized_columns[1].interpolate).toBe(false);
		expect(vm.normalized_columns[1].sortable).toBe(true);
		expect(vm.normalized_columns[1].filterable).toBe(true);

		expect(vm.normalized_columns[2].align).toBe('left');
		expect(vm.normalized_columns[2].label).toBe('Component');
		expect(vm.normalized_columns[2].field).toBe(null);
		expect(vm.normalized_columns[2].representedAs).toBe(null);
		expect(vm.normalized_columns[2].component).toBe('test-component');
		expect(vm.normalized_columns[2].interpolate).toBe(false);
		expect(vm.normalized_columns[2].sortable).toBe(false);
		expect(vm.normalized_columns[2].filterable).toBe(false);
	});

	it('normalizes the columns', () => {
		const vm = getTableElement();

		expect(vm.table_class).toBe('table table-hover table-striped');
	});

	it('determines if a column is being sorted by', () => {
		const vm = getTableElement(function(vm){
			vm.sort_dir = 'asc';
			vm.sort_by = vm.normalized_columns[1];
		});

		expect(vm.getSortDirectionForColumn(vm.normalized_columns[0])).toBe(null);
		expect(vm.getSortDirectionForColumn(vm.normalized_columns[1])).toBe('asc');
		expect(vm.getSortDirectionForColumn(vm.normalized_columns[2])).toBe(null);
	});

	it('can set column to b sorted by', () => {
		const vm = getTableElement(function(vm){
			vm.setSortDirectionForColumn('desc', vm.normalized_columns[2]);
		});

		expect(vm.sort_by).toBe(vm.normalized_columns[2]);
		expect(vm.sort_dir).toBe('desc');
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
        const vm = getTableElement(function(vm){
			vm.filterBy = 'Jo do';
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('1');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('John Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');
    });

    it('can override filter logic', () => {
        const vm = getTableElement(function(vm){
			vm.filterBy = 'Jo do';
			vm.handler.filterHandler = function(rows, filter_text, columns){
				return rows.filter(function(row){
					expect(filter_text).toBe('Jo do');

					return row.id === 2;
				});
			};
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('2');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('Jane Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');

		vm.handler.filterHandler = vm.handler.handleFilter;
    });

    it('will not filter component cells by default', () => {
        const vm = getTableElement(function(vm){
			vm.filterBy = 'Test';
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(0);
    });

    it('will filter component cells when representedAs is defined', () => {
        const vm = getTableElement(function(vm){
			vm.filterBy = 'Test';
			vm.columns[2].representedAs = function(row){
				return 'Test Component';
			};
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(2);
    });

    it('can limit the number of rows displayed', () => {
        const vm = getTableElement(function(vm){
			vm.per_page = 1;
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('1');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('John Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');
    });

    it('can determine which page of rows to display', () => {
        const vm = getTableElement(function(vm){
			vm.per_page = 1;
			vm.page = 2;
			vm.processRows();
		});

		expect(vm.$el.querySelectorAll('tbody tr').length).toBe(1);

		expect(vm.$el.querySelectorAll('tbody tr td')[0].textContent.trim()).toBe('2');
		expect(vm.$el.querySelectorAll('tbody tr td')[1].textContent.trim()).toBe('Jane Doe');
		expect(vm.$el.querySelectorAll('tbody tr td')[2].textContent.trim()).toBe('Test Component');
    });
}

function getTableElement(callback){
	let vm = new Ctor({propsData: {
		columns: [
			{label: 'Field', field: 'id'},
			{label: 'Representation', representedAs: function(row){
				return row.user.first_name + ' ' + row.user.last_name;
			}},
			{label: 'Component', component: 'test-component'}
		],
		data: [
			{id: 1, user: {first_name: 'John', last_name: 'Doe'}},
			{id: 2, user: {first_name: 'Jane', last_name: 'Doe'}},
		],
	}});

	if(callback && typeof callback === 'function'){
		callback(vm);
	}

	vm.$mount();

	return vm;
}
