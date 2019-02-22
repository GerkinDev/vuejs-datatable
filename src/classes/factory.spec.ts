import Factory from './factory.js';
import { createLocalVue } from '@vue/test-utils';

beforeEach(() => {
	jest.clearAllMocks();
});
it('is initialized with empty types', () => {
	const factory = new Factory();

	expect(factory.tableTypes instanceof Object).toBe(true);
	expect(Object.keys(factory.tableTypes)).toHaveLength(0);
});

it('is initialized using default datatable type', () => {
	const factory = new Factory();

	expect(factory.useDefaultType()).toBe(true);
});

it('can disable default datatable type', () => {
	const factory = new Factory();

	expect(factory.useDefaultType()).toBe(true);

	factory.useDefaultType(false);

	expect(factory.useDefaultType()).toBe(false);
});

describe('Registration', () => {
	it('can register a new datatable type', () => {
		const factory = new Factory();

		expect(Object.keys(factory.tableTypes)).toHaveLength(0);

		factory.registerTableType('testtable');

		expect(Object.keys(factory.tableTypes)).toHaveLength(1);
		expect(factory.tableTypes).toHaveProperty('testtable');
	});

	it('registration passes callback that can customize settings', () => {
		const factory = new Factory();
		const registerCb = jest.fn();

		factory.registerTableType('testtable', registerCb);
		expect(registerCb).toHaveBeenCalledTimes(1);
		expect(registerCb).toHaveBeenCalledWith(factory.tableTypes.testtable);
	});
});

describe('Installation', () => {
	it('Can be installed into Vue', () => {
		const factory = new Factory();

		expect(typeof factory.install).toBe('function');
		jest.spyOn(factory, 'installTableType').mockImplementation();
		const localVue = createLocalVue();
		factory.install(localVue as any);
		expect(factory.installTableType).toHaveBeenCalledTimes(1);
		expect(factory.installTableType).toHaveBeenCalledWith('datatable', factory.tableTypes.datatable, localVue);
	});

	it('Queue registration while not installed', () => {
		const factory = new Factory();

		jest.spyOn(factory, 'installTableType').mockImplementation();

		factory.registerTableType('foo');
		factory.registerTableType('bar');
		expect(factory.installTableType).toHaveBeenCalledTimes(0);

		const localVue = createLocalVue();
		factory.install(localVue as any);

		expect(factory.installTableType).toHaveBeenCalledTimes(3);
		expect(factory.installTableType).toHaveBeenCalledWith('datatable', factory.tableTypes.datatable, localVue);
		expect(factory.installTableType).toHaveBeenCalledWith('foo', factory.tableTypes.foo, localVue);
		expect(factory.installTableType).toHaveBeenCalledWith('bar', factory.tableTypes.bar, localVue);
	});

	it('Registrer immediately once installed', () => {
		const factory = new Factory();

		jest.spyOn(factory, 'installTableType').mockImplementation();

		const localVue = createLocalVue();
		factory.install(localVue as any);

		expect(factory.installTableType).toHaveBeenCalledTimes(1);
		expect(factory.installTableType).toHaveBeenLastCalledWith('datatable', factory.tableTypes.datatable, localVue);

		factory.registerTableType('foo');
		expect(factory.installTableType).toHaveBeenCalledTimes(2);
		expect(factory.installTableType).toHaveBeenLastCalledWith('foo', factory.tableTypes.foo, localVue);

		factory.registerTableType('bar');
		expect(factory.installTableType).toHaveBeenCalledTimes(3);
		expect(factory.installTableType).toHaveBeenLastCalledWith('bar', factory.tableTypes.bar, localVue);
	});
});
