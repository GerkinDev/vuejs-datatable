// tslint:disable-next-line: no-implicit-dependencies
import { createLocalVue } from '@vue/test-utils';

jest.mock( './table-type' );
import { DatatableFactory } from './datatable-factory';
// @ts-ignore
import { getPagerDefinition, getTableDefinition, TableType } from './table-type';

beforeEach( () => {
	jest.clearAllMocks();
} );
it( 'is initialized with only the default table type registered', () => {
	jest.spyOn( DatatableFactory.prototype, 'registerTableType' );
	const factory = new DatatableFactory();

	expect( factory.registerTableType ).toHaveBeenCalledTimes( 1 );
	expect( factory.registerTableType ).toHaveBeenCalledWith( factory['defaultTableType' as any] );
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

		let sourceTableType: TableType<any> | undefined;
		if ( useTableType ) {
			sourceTableType = new TableType( name );
		}

		let tableTypeSave: TableType<any>;
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

		expect( factory['tableTypes' as any] as any ).toHaveProperty( name );
		expect( factory['tableTypes' as any][name] ).toBeInstanceOf( TableType );
		expect( factory['tableTypes' as any][name].id ).toEqual( name );
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
		expect( factory['installTableType' as any] ).toHaveBeenCalledTimes( 0 );

		const localVue = createLocalVue();
		factory.install( localVue );

		expect( factory['installTableType' as any] ).toHaveBeenCalledTimes( 3 );
		expect( factory['installTableType' as any] ).toHaveBeenCalledWith( 'datatable' );
		expect( factory['installTableType' as any] ).toHaveBeenCalledWith( 'foo' );
		expect( factory['installTableType' as any] ).toHaveBeenCalledWith( 'bar' );
	} );
	it( 'Check installation', () => {
		const factory = new DatatableFactory();

		const tt = new TableType<any>( 'foo' );
		factory['tableTypes' as any].foo = tt;
		factory['vueInstance' as any] = createLocalVue();
		jest.spyOn( factory['vueInstance' as any], 'component' ).mockImplementation();
		expect( factory['installTableType' as any]( 'foo' ) ).toEqual( factory );

		expect( factory['vueInstance' as any].component ).toHaveBeenCalledTimes( 2 );
		expect( getTableDefinition ).toHaveBeenCalledTimes( 1 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 1 );
		expect( factory['vueInstance' as any].component ).toHaveBeenNthCalledWith( 1, 'foo', tt.getTableDefinition() );
		expect( factory['vueInstance' as any].component ).toHaveBeenNthCalledWith( 2, 'foo-pager', tt.getPagerDefinition() );
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

		let sourceTableType: TableType<any> | undefined;
		if ( useTableType ) {
			sourceTableType = factory['tableTypes' as any][name];
		}

		let mockUninstall: jest.Mock<any, [any]> | undefined;
		if ( afterInstall ) {
			mockUninstall = jest.spyOn( factory as any, 'uninstallTableType' ).mockImplementation() as any;
			const localVue = createLocalVue();
			factory.install( localVue );
		}

		expect( factory['tableTypes' as any] as any ).toHaveProperty( name );
		factory.deregisterTableType( sourceTableType || name );

		expect( factory['tableTypes' as any] as any ).not.toHaveProperty( name );
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
		expect( factory['installTableType' as any] ).toHaveBeenCalledTimes( 0 );
		expect( factory['uninstallTableType' as any] ).toHaveBeenCalledTimes( 0 );

		const localVue = createLocalVue();
		jest.spyOn( localVue, 'component' ).mockImplementation();
		factory.install( localVue );

		expect( factory['vueInstance' as any].component ).toHaveBeenCalledTimes( 2 );
		expect( getTableDefinition ).toHaveBeenCalledTimes( 0 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 0 );
		expect( factory['installTableType' as any] ).toHaveBeenCalledTimes( 0 );
		expect( factory['uninstallTableType' as any] ).toHaveBeenCalledTimes( 0 );
	} );
	it( 'Check uninstallation', () => {
		const factory = new DatatableFactory();

		const tt = new TableType<any>( 'foo' );
		factory['tableTypes' as any].foo = tt;
		factory['vueInstance' as any] = createLocalVue();
		expect( factory['installTableType' as any]( 'foo' ) ).toEqual( factory );

		expect( getTableDefinition ).toHaveBeenCalledTimes( 1 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 1 );
		expect( Object.keys( ( factory['vueInstance' as any] as any ).options.components ) ).toHaveLength( 2 );
		expect( factory['uninstallTableType' as any]( 'foo' ) ).toEqual( factory );
		expect( getTableDefinition ).toHaveBeenCalledTimes( 1 );
		expect( getPagerDefinition ).toHaveBeenCalledTimes( 1 );
		expect( Object.keys( ( factory['vueInstance' as any] as any ).options.components ) ).toHaveLength( 0 );
	} );
} );

it( 'Get table type', () => {
	const factory = new DatatableFactory();
	expect( factory.getTableType() ).toEqual( factory['tableTypes' as any].datatable );
	expect( factory.getTableType( 'datatable' ) ).toEqual( factory['tableTypes' as any].datatable );
	expect( factory.getTableType( 'missing' ) ).toBeUndefined();
} );
describe( 'Use default type function', () => {
	const factory = new DatatableFactory();

	expect( factory.useDefaultType() ).toEqual( true );
	expect( factory['tableTypes' as any] ).toHaveProperty( 'datatable', factory['defaultTableType' as any] );
	expect( factory.useDefaultType( false ) ).toEqual( factory );
	expect( factory['tableTypes' as any] ).not.toHaveProperty( 'datatable' );
	expect( factory.useDefaultType( true ) ).toEqual( factory );
	expect( factory['tableTypes' as any] ).toHaveProperty( 'datatable', factory['defaultTableType' as any] );
} );
