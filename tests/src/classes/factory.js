import Factory from '../../../src/classes/factory.js';

export default () => {
    it('is initialized with empty types', () => {
        let handler = new Factory();

        expect(Array.isArray(handler.table_types)).toBe(true);
        expect(handler.table_types.length).toBe(0);
    });

    it('is initialized using default datatable type', () => {
        let handler = new Factory();

        expect(handler.use_default_type).toBe(true);
    });

    it('can disable default datatable type', () => {
        let handler = new Factory();

        expect(handler.use_default_type).toBe(true);

        handler.useDefaultType(false);

        expect(handler.use_default_type).toBe(false);
    });

    it('can register a new datatable type', () => {
        let handler = new Factory();

        expect(handler.table_types.length).toBe(0);

        handler.registerTableType('testtable');

        expect(handler.table_types.length).toBe(1);
    });

    it('registration passes callback that can customize settings', () => {
        let handler = new Factory();

        handler.registerTableType('testtable', function(table_type){
            expect(typeof table_type).toBe('object');
            expect(typeof table_type.mergeSettings).toBe('function');
            expect(typeof table_type.setting).toBe('function');
        });
    });

    it('registration passes callback that can customize handler', () => {
        let handler = new Factory();

        handler.registerTableType('testtable', function(table_type){
            expect(typeof table_type).toBe('object');
            expect(typeof table_type.setFilterHandler).toBe('function');
            expect(typeof table_type.setSortHandler).toBe('function');
            expect(typeof table_type.setPaginateHandler).toBe('function');
            expect(typeof table_type.setDisplayHandler).toBe('function');
        });
    });

    it('can be installed into Vue', () => {
        let handler = new Factory();

        expect(typeof handler.install).toBe('function');
    });
}
