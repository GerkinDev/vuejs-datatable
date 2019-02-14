import Vue from 'vue';
import Column from '../../../src/classes/column.js';

Vue.component('test-component', {
	props:    [ 'row' ],
	template: `
		<span>Test Component</span>
	`,
});

export default () => {
	it('normalizes properties', () => {
		const column = new Column({});

		expect(column.label).toBe('');
		expect(column.align).toBe('left');
		expect(column.field).toBe(null);
		expect(column.representedAs).toBe(null);
		expect(column.component).toBe(null);
		expect(column.sortable).toBe(false);
		expect(column.filterable).toBe(false);
	});

	it('sets label', () => {
		const column = new Column({
			label: 'test',
		});

		expect(column.label).toBe('test');
	});

	it('sets alignment', () => {
		const columnR = new Column({
			align: 'right',
		});
		const columnC = new Column({
			align: 'center',
		});
		const columnL = new Column({
			align: 'bogus',
		});
		const column = new Column({
			align: 'CeNTeR',
		});

		expect(columnR.align).toBe('right');
		expect(columnC.align).toBe('center');
		expect(columnL.align).toBe('left');
		expect(column.align).toBe('center');
	});

	it('sets field', () => {
		const column = new Column({
			field: 'user.name',
		});

		expect(column.field).toBe('user.name');
	});

	it('sets callback', () => {
		const column = new Column({
			representedAs: () =>'test',
		});

		expect(typeof column.representedAs).toBe('function');
		expect(column.getRepresentation(null)).toBe('test');
		expect(column.getValue(null)).toBe('test');
	});

	it('sets component', () => {
		const column = new Column({
			component: 'test-component',
		});

		expect(column.component).toBe('test-component');
	});

	it('sets sortability', () => {
		// components should not be sortable by default
		expect((new Column({
			component: 'test-component',
		})).sortable).toBe(false);

		// component columns that specify a field should be sortable
		expect((new Column({
			field:     'test',
			component: 'test-component',
		})).sortable).toBe(true);

		// component columns that specify a representation should be sortable
		expect((new Column({
			component:     'test-component',
			representedAs: () =>'test',
		})).sortable).toBe(true);

		// column with no field or representation should not be sortable
		expect((new Column({})).sortable).toBe(false);

		// columns with a field should be sortable
		expect((new Column({
			field: 'test',
		})).sortable).toBe(true);

		// columns with a representation should be sortable
		expect((new Column({
			representedAs: () =>'test',
		})).sortable).toBe(true);

		// columns marked as unsortable should not be sortable
		expect((new Column({
			field:    'test',
			sortable: false,
		})).sortable).toBe(false);
	});
};
