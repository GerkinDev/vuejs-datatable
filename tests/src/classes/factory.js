import Factory from '../../../src/classes/factory.js';

export default () => {
	it('is initialized with empty types', () => {
		const handler = new Factory();

		expect(Array.isArray(handler.tableTypes)).toBe(true);
		expect(handler.tableTypes.length).toBe(0);
	});

	it('is initialized using default datatable type', () => {
		const handler = new Factory();

		expect(handler.useDefaultType).toBe(true);
	});

	it('can disable default datatable type', () => {
		const handler = new Factory();

		expect(handler.useDefaultType).toBe(true);

		handler.useDefaultType(false);

		expect(handler.useDefaultType).toBe(false);
	});

	it('can register a new datatable type', () => {
		const handler = new Factory();

		expect(handler.tableTypes.length).toBe(0);

		handler.registerTableType('testtable');

		expect(handler.tableTypes.length).toBe(1);
	});

	it('registration passes callback that can customize settings', () => {
		const handler = new Factory();

		handler.registerTableType('testtable', tableType => {
			expect(typeof tableType).toBe('object');
			expect(typeof tableType.mergeSettings).toBe('function');
			expect(typeof tableType.setting).toBe('function');
		});
	});

	it('registration passes callback that can customize handler', () => {
		const handler = new Factory();

		handler.registerTableType('testtable', tableType => {
			expect(typeof tableType).toBe('object');
			expect(typeof tableType.setFilterHandler).toBe('function');
			expect(typeof tableType.setSortHandler).toBe('function');
			expect(typeof tableType.setPaginateHandler).toBe('function');
			expect(typeof tableType.setDisplayHandler).toBe('function');
		});
	});

	it('can be installed into Vue', () => {
		const handler = new Factory();

		expect(typeof handler.install).toBe('function');
	});

	it.todo('Test IIFE register/deregister');
};
