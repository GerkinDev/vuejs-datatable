import Vue from 'vue';
import Column from '../../../src/classes/column.js';

const vm = new Vue();

Vue.component('test-component', {
	template: `
		<span>Test Component</span>
	`,
	props: ['row']
});

export default () => {
    it('normalizes properties', () => {
        let column = new Column({});

		expect(column.label).toBe('');
		expect(column.align).toBe('left');
		expect(column.field).toBe(null);
		expect(column.representedAs).toBe(null);
		expect(column.component).toBe(null);
		expect(column.sortable).toBe(false);
        expect(column.filterable).toBe(false);
    });

    it('sets label', () => {
        let column = new Column({
			label: 'test'
		});

		expect(column.label).toBe('test');
    });

	it('sets alignment', () => {
		let column_r = new Column({
			align: 'right'
		});
		let column_c = new Column({
			align: 'center'
		});
		let column_l = new Column({
			align: 'bogus'
		});
		let column = new Column({
			align: 'CeNTeR'
		});

		expect(column_r.align).toBe('right');
		expect(column_c.align).toBe('center');
		expect(column_l.align).toBe('left');
		expect(column.align).toBe('center');
	});

    it('sets field', () => {
        let column = new Column({
			field: 'user.name'
		});

		expect(column.field).toBe('user.name');
    });

    it('sets callback', () => {
        let column = new Column({
			representedAs: function(row){
				return 'test';
			}
		});

		expect(typeof column.representedAs).toBe('function');
		expect(column.getRepresentation(null)).toBe('test');
		expect(column.getValue(null)).toBe('test');
    });

    it('sets component', () => {
        let column = new Column({
			component: 'test-component'
		});

		expect(column.component).toBe('test-component');
    });

    it('sets sortability', () => {
		// components should not be sortable by default
		expect((new Column({
			component: 'test-component'
		})).sortable).toBe(false);

		// component columns that specify a field should be sortable
		expect((new Column({
			field: 'test',
			component: 'test-component'
		})).sortable).toBe(true);

		// component columns that specify a representation should be sortable
		expect((new Column({
			component: 'test-component',
			representedAs: function(row){return 'test';}
		})).sortable).toBe(true);

		// column with no field or representation should not be sortable
		expect((new Column({})).sortable).toBe(false);

		// columns with a field should be sortable
		expect((new Column({
			field: 'test'
		})).sortable).toBe(true);

		// columns with a representation should be sortable
		expect((new Column({
			representedAs: function(row){return 'test';}
		})).sortable).toBe(true);

		// columns marked as unsortable should not be sortable
		expect((new Column({
			field: 'test',
			sortable: false
		})).sortable).toBe(false);
    });
}
