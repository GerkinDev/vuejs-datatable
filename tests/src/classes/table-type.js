import TableType from '../../../src/classes/table-type.js';

export default () => {
	it('is initialized with name, settings, and handler', () => {
		const tabletype = new TableType('name');

		expect(tabletype.id).toBe('name');
		expect(typeof tabletype.settings).toBe('object');
		expect(typeof tabletype.handler).toBe('object');
	});

	it('can return it\'s name', () => {
		const tabletype = new TableType('name');

		expect(tabletype.getId()).toBe('name');
	});

	it('can customize handlers', () => {
		const tabletype = new TableType('name');

		expect(typeof tabletype.setFilterHandler).toBe('function');
		expect(typeof tabletype.setSortHandler).toBe('function');
		expect(typeof tabletype.setPaginateHandler).toBe('function');
		expect(typeof tabletype.setDisplayHandler).toBe('function');
	});

	it('can customize settings', () => {
		const tabletype = new TableType('name');

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
		const tabletype = new TableType('name');
		const orgObj = {id: 1};
		const newObj = tabletype.clone(orgObj);

		expect(newObj).not.toBe(orgObj);
		expect(newObj).toEqual(orgObj);
	});
};
