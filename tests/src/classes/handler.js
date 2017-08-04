import Handler from '../../../src/classes/handler.js';
import Column from '../../../src/classes/column.js';

const rows = [
    {id: 1, user:{first_name: 'John', last_name: 'Doe'}},
    {id: 2, user:{first_name: 'Jane', last_name: 'Doe'}},
];

const columns = [
    new Column({label: 'ID', field: 'id'}),
    new Column({label: 'Last Name', field: 'user.last_name'}),
    new Column({label: 'Slug Name', representedAs: function(row){
        return row.user.first_name + row.user.last_name;
    }})
];

export default () => {
    it('has the correct methods', () => {
        let handler = new Handler();

        expect(typeof handler.filterHandler).toBe('function');
        expect(typeof handler.sortHandler).toBe('function');
        expect(typeof handler.paginateHandler).toBe('function');
		expect(typeof handler.displayHandler).toBe('function');
    });

    it('can filter data', () => {
        let handler = new Handler();

        var filtered = handler.filterHandler(
            rows, 'jo do', columns
        );

        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(1);

        filtered = handler.filterHandler(
            rows, 'nedo', columns
        );

        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(2);

        filtered = handler.filterHandler(
            rows, 'bogus', columns
        );

        expect(filtered.length).toBe(0);

        filtered = handler.filterHandler(
            rows, 'j doe', columns
        );

        expect(filtered.length).toBe(2);
        expect(filtered[0].id).toBe(1);
        expect(filtered[1].id).toBe(2);
    });

    it('can sort data', () => {
        let handler = new Handler();

        var sorted = handler.sortHandler(
            rows, columns[0], 'asc'
        );

        expect(sorted.length).toBe(2);
        expect(sorted[0].id).toBe(1);
        expect(sorted[1].id).toBe(2);

        sorted = handler.sortHandler(
            rows, columns[0], 'desc'
        );

        expect(sorted.length).toBe(2);
        expect(sorted[0].id).toBe(2);
        expect(sorted[1].id).toBe(1);

        sorted = handler.sortHandler(
            rows, columns[2], 'asc'
        );

        expect(sorted.length).toBe(2);
        expect(sorted[0].id).toBe(2);
        expect(sorted[1].id).toBe(1);

        sorted = handler.sortHandler(
            rows, columns[2], 'desc'
        );

        expect(sorted.length).toBe(2);
        expect(sorted[0].id).toBe(1);
        expect(sorted[1].id).toBe(2);
    });

    it('can paginate data', () => {
        let handler = new Handler();

        var paged = handler.paginateHandler(
            rows, 1, 1
        );

        expect(paged.length).toBe(1);
        expect(paged[0].id).toBe(1);

        paged = handler.paginateHandler(
            rows, 1, 2
        );

        expect(paged.length).toBe(1);
        expect(paged[0].id).toBe(2);
    });

    it('can manipulate data', () => {
        let handler = new Handler();
        var manipulated = [];

        handler.displayHandler(rows, {filtered_data: [{}]}, function(rows){
            manipulated = rows.slice(1);
        }, function(total_rows){
            expect(total_rows).toBe(1);
        });

        expect(manipulated.length).toBe(1);
        expect(manipulated[0].id).toBe(2);
    });
}
