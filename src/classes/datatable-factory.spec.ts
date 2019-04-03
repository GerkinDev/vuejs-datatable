// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue } from '@vue/test-utils';

jest.mock( './table-type' );
import { DatatableFactory } from './datatable-factory';
import { TableType, getPagerDefinition, getTableDefinition } from './table-type';

beforeEach( () => {
	jest.clearAllMocks();
} );
it( 'is initialized with only the default table type registered', () => {
	jest.spyOn( DatatableFactory.prototype, 'registerTableType' );
	const factory = new DatatableFactory();

	expect( factory.registerTableType ).toHaveBeenCalledTimes( 1 );
	expect( factory.registerTableType ).toHaveBeenCalledWith( factory['defaultTableType'] );
} );

describe( 'Registration & installation', () => {
	it.each`
useTableType  | transform | transformReturn | afterInstall
${false}      | ${false}  | ${false}        | ${false}
${false}      | ${false}  | ${false}        | ${true}
${false}      | ${true}   | ${false}        | ${false}
${false}      | ${true}   | ${false}        | ${true}
${false}      | ${true}   | ${true}         | ${false}
${false}      | ${true}   | ${true}         | ${true}
${true}       | ${false}  | ${false}        | ${false}
${true}       | ${false}  | ${false}        | ${true}
${true}       | ${true}   | ${false}        | ${false}
${true}       | ${true}   | ${false}        | ${true}
${true}       | ${true}   | ${true}         | ${false}
${true}       | ${true}   | ${true}         | ${true}`(
	'Use TableType "$useTableType", transform: "$transform" that returns: "$transformReturn", afterInstall: "$afterInstall"',
	( { useTableType, transform, transformReturn, afterInstall } ) => {
		const factory = new DatatableFactory();

		const name = `${useTableType}-${transform}-${transformReturn}-${afterInstall}`;

		let sourceTableType: TableType | undefined;
		if ( useTableType ) {
			sourceTableType = new TableType( name );
		}

		let tableTypeSave: TableType;
		let mockTransform: jest.Mock<any, [any]> | undefined;
		if ( transform ) {
			mockTransform = transformReturn ?
				jest.fn( tableType => tableTypeSave = Object.assign( Object.create( Object.getPrototypeOf( tableType ) ), tableType, { id: tableType.id } ) ) :
				jest.fn( tableType => { tableTypeSave = tableType; } );
		}

		let mockInstall: jest.Mock<any, [any]> | undefined;
		if ( afterInstall ) {
			mockInstall = jest.spyOn( factory as any, 'installTableType' ).mockImplementation() as any;
			const localVue = createLocalVue();
			factory.install( localVue );
		}

		factory.registerTableType( sourceTableType || name, mockTransform );

		expect( factory['tableTypes'] as any ).toHaveProperty( name );
		expect( factory['tableTypes'][name] ).toBeInstanceOf( TableType );
		expect( factory['tableTypes'][name].id ).toEqual( name );
		if ( transform ) {
			expect( mockTransform ).toHaveBeenCalledTimes( 1 );
		}
		if ( afterInstall ) {
			expect( mockInstall ).toHaveBeenCalledTimes( 2 );
			expect( mockInstall ).toHaveBeenNthCalledWith( 2, name );
		}
	} );

	it( 'Queue registration while not installed', () => {
		const factory = new DatatableFactory();

		jest.spyOn( factory as any, 'installTableType' ).mockImplementation();

		factory.registerTableType( 'foo' );
		factory.registerTableType( 'bar' );
		expect( factory['installTableType'] ).toHaveBeenCalledTimes( 0 );

		const localVue = createLocalVue();
		factory.install( localVue );

		expect( factory['installTableType'] ).toHaveBeenCalledTimes( 3 );
		expect( factory['installTableType'] ).toHaveBeenCalledWith( 'datatable' );
		expect( factory['installTableType'] ).toHaveBeenCalledWith( 'foo' );
		expect( factory['installTableType'] ).toHaveBeenCalledWith( 'bar' );
	} );
	it( 'Check installation', () => {
		const factory = new DatatableFactory();

		const tt = new TableType( 'foo' );
		factory['tableTypes'].foo = tt;
		factory['vueInstance'] = createLocalVue();
		jest.spyOn( factory['vueInstance'], 'component' ).mockImplementation();
		expect( factory['installTableType']( 'foo' ) ).toEqual( factory );

		expect( factory['vueInstance'].component ).toHaveBeenCalledTimes( 2 );
		expect( getTableDefinition ).toHaveBeenCalledTimes( 1 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 1 );
		expect( factory['vueInstance'].component ).toHaveBeenNthCalledWith( 1, 'foo', tt.getTableDefinition() );
		expect( factory['vueInstance'].component ).toHaveBeenNthCalledWith( 2, 'foo-pager', tt.getPagerDefinition() );
	} );
} );
describe( 'Deregistration & uninstallation', () => {
	it.each`
useTableType  | afterInstall
${false}      | ${false}
${false}      | ${true}
${true}       | ${false}
${true}       | ${true}`(
	'Use TableType "$useTableType", afterInstall: "$afterInstall"',
	( { useTableType, afterInstall } ) => {
		const factory = new DatatableFactory();

		const name = 'datatable';

		let sourceTableType: TableType | undefined;
		if ( useTableType ) {
			sourceTableType = factory['tableTypes'][name];
		}

		let mockUninstall: jest.Mock<any, [any]> | undefined;
		if ( afterInstall ) {
			mockUninstall = jest.spyOn( factory as any, 'uninstallTableType' ).mockImplementation() as any;
			const localVue = createLocalVue();
			factory.install( localVue );
		}

		expect( factory['tableTypes'] as any ).toHaveProperty( name );
		factory.deregisterTableType( sourceTableType || name );

		expect( factory['tableTypes'] as any ).not.toHaveProperty( name );
		if ( afterInstall ) {
			expect( mockUninstall ).toHaveBeenCalledTimes( 1 );
			expect( mockUninstall ).toHaveBeenCalledWith( name );
		}
	} );
	it( 'Deregistered table won\'t be installed on factory installation', () => {
		const factory = new DatatableFactory();

		jest.spyOn( factory as any, 'installTableType' ).mockImplementation();
		jest.spyOn( factory as any, 'uninstallTableType' ).mockImplementation();

		factory.deregisterTableType( 'datatable' );
		expect( factory['installTableType'] ).toHaveBeenCalledTimes( 0 );
		expect( factory['uninstallTableType'] ).toHaveBeenCalledTimes( 0 );

		const localVue = createLocalVue();
		jest.spyOn( localVue, 'component' ).mockImplementation();
		factory.install( localVue );

		expect( factory['vueInstance'].component ).toHaveBeenCalledTimes( 3 );
		expect( getTableDefinition ).toHaveBeenCalledTimes( 0 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 0 );
		expect( factory['installTableType'] ).toHaveBeenCalledTimes( 0 );
		expect( factory['uninstallTableType'] ).toHaveBeenCalledTimes( 0 );
	} );
	it( 'Check uninstallation', () => {
		const factory = new DatatableFactory();

		const tt = new TableType( 'foo' );
		factory['tableTypes'].foo = tt;
		factory['vueInstance'] = createLocalVue();
		expect( factory['installTableType']( 'foo' ) ).toEqual( factory );

		expect( getTableDefinition ).toHaveBeenCalledTimes( 1 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 1 );
		expect( Object.keys( factory['vueInstance'].options.components ) ).toHaveLength( 2 );
		expect( factory['uninstallTableType']( 'foo' ) ).toEqual( factory );
		expect( getTableDefinition ).toHaveBeenCalledTimes( 2 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 2 );
		expect( Object.keys( factory['vueInstance'].options.components ) ).toHaveLength( 0 );
	} );
} );

it( 'Get table type', () => {
	const factory = new DatatableFactory();
	expect( factory.getTableType() ).toEqual( factory['tableTypes'].datatable );
	expect( factory.getTableType( 'datatable' ) ).toEqual( factory['tableTypes'].datatable );
	expect( factory.getTableType( 'missing' ) ).toBeUndefined();
} );
describe( 'Use default type function', () => {
	const factory = new DatatableFactory();

	expect( factory.useDefaultType() ).toEqual( true );
	expect( factory['tableTypes'] ).toHaveProperty( 'datatable', factory['defaultTableType'] );
	expect( factory.useDefaultType( false ) ).toEqual( factory );
	expect( factory['tableTypes'] ).not.toHaveProperty( 'datatable' );
	expect( factory.useDefaultType( true ) ).toEqual( factory );
	expect( factory['tableTypes'] ).toHaveProperty( 'datatable', factory['defaultTableType'] );
} );
