import TableType from '../../../src/classes/table-type.js';
import Datatable from '../../../src/vue-datatable.vue';

export default () => {
    it('is initialized with name, settings, and handler', () => {
        let tabletype = new TableType('name');

        expect(tabletype.id).toBe('name');
        expect(typeof tabletype.settings).toBe('object');
        expect(typeof tabletype.handler).toBe('object');
    });

    it('can return it\'s name', () => {
        let tabletype = new TableType('name');

        expect(tabletype.getId()).toBe('name');
    });

    it('can customize handlers', () => {
        let tabletype = new TableType('name');

        expect(typeof tabletype.setFilterHandler).toBe('function');
        expect(typeof tabletype.setSortHandler).toBe('function');
        expect(typeof tabletype.setPaginateHandler).toBe('function');
        expect(typeof tabletype.setDisplayHandler).toBe('function');
    });

    it('can customize settings', () => {
        let tabletype = new TableType('name');

        expect(typeof tabletype.setting).toBe('function');
        expect(typeof tabletype.mergeSettings).toBe('function');
    });

    // TODO: figure out how to test this
    it('will duplicate a new table definition', () => {
        pending('not sure how to test this.');
    });

    // TODO: figure out how to test this
    it('will duplicate a new pager definition', () => {
        pending('not sure how to test this.');
    });

    it('can clone objects', () => {
        let tabletype = new TableType('name');
        let org_obj = {id: 1};
        let new_obj = tabletype.clone(org_obj);

        expect(new_obj).not.toBe(org_obj);
        expect(new_obj).toEqual(org_obj);
    });
}
