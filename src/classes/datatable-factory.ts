import Vue, { PluginObject } from 'vue';

import { VueDatatableCell } from '../components/vue-datatable-cell/vue-datatable-cell';
import { VueDatatableHeader } from '../components/vue-datatable-header/vue-datatable-header';
import { TableType } from './table-type';

const DEFAULT_DATATABLE = 'datatable';

/**
 * Registers Vuejs-Datatable components globally in VueJS.
 *
 * @example
 * import DatatableFactory from 'vuejs-datatable';
 * Vue.use(DatatableFactory);
 */
export class DatatableFactory implements PluginObject<void> {
	/** A reference to the Vue instance the plugin is installed in. It may be used to check if the factory was already installed */
	private vueInstance?: typeof Vue;
	/** Registry of declared table types. */
	private readonly tableTypes: {[key: string]: TableType<any>} = {};
	/** The default table type to use if no other configuration was provided. */
	private readonly defaultTableType = new TableType<any>( DEFAULT_DATATABLE );

	/**
	 * Initialize the default factory
	 */
	public constructor() {
		this.tableTypes = {};

		this.useDefaultType( true );
	}

	/**
	 * Get a table type by its identifier.
	 *
	 * @param id - The identifier of the table type. If not provided, it will default to the default table type.
	 * @returns the table type registered with that identifier.
	 */
	public getTableType( id: string = DEFAULT_DATATABLE ): TableType<any> | undefined {
		return this.tableTypes[id];
	}

	/**
	 * Controls the use of the default table type.
	 *
	 * @param use - `true` to use the default type, `false` otherwise.
	 * @returns `this` for chaining.
	 */
	public useDefaultType( use: boolean ): this;
	/**
	 * Check if the factory uses the default table type.
	 *
	 * @returns a boolean indicating if the factory uses the default table type.
	 */
	public useDefaultType(): boolean;
	public useDefaultType( use?: boolean ): this | boolean {
		if ( typeof use !== 'boolean' && !use ) {
			return this.tableTypes[DEFAULT_DATATABLE] === this.defaultTableType;
		}
		if ( use ) {
			this.registerTableType( this.defaultTableType );
		} else {
			this.deregisterTableType( this.defaultTableType );
		}

		return this;
	}

	/**
	 * Creates a new table type with a specified prefix, that you can customize using a callback.
	 *
	 * @param nameOrTableType - The name of the component to register, or a {@link TableType} object.
	 * @param callback        - An optional function to execute, that configures the newly created {@link TableType}. It takes a single parameter: the newly created {@link TableType}, and should
	 * return the transformed table type.
	 * @returns `this` for chaining.
	 */
	public registerTableType<TRow extends {} = {}, TSource = TRow[], TFiltered = TRow[], TSorted = TRow[], TPaged = TRow[]>(
		nameOrTableType: string | TableType<TRow, TSource, TFiltered, TSorted, TPaged>,
		callback?: ( tableType: TableType<TRow, TSource, TFiltered, TSorted, TPaged> ) => TableType<TRow, TSource, TFiltered, TSorted, TPaged> | undefined,
	): this {
		const tableType = nameOrTableType instanceof TableType ? nameOrTableType : new TableType<TRow, TSource, TFiltered, TSorted, TPaged>( nameOrTableType );
		const transformedTableType = ( callback && typeof callback === 'function' ) ? callback( tableType ) || tableType : tableType;

		const name = transformedTableType.id;
		this.tableTypes[name] = transformedTableType as any;
		if ( this.vueInstance ) {
			this.installTableType( name );
		}

		return this;
	}

	/**
	 * Creates a new table type with a specified prefix, that you can customize using a callback.
	 *
	 * @param nameOrTableType - The name of the component to register, or a {@link TableType} object.
	 * @returns `this` for chaining.
	 */
	public deregisterTableType( nameOrTableType: string | TableType<any> ): this {
		const name = nameOrTableType instanceof TableType ? nameOrTableType.id : nameOrTableType;

		if ( this.vueInstance ) {
			this.uninstallTableType( name );
		}
		delete this.tableTypes[name];

		return this;
	}

	/**
	 * Declares global components exported by vuejs-datatable, & load configs.
	 *
	 * @param Vue - The Vue instance to configure.
	 * @returns nothing.
	 */
	public install( vue: typeof Vue ): void {
		this.vueInstance = vue;
		vue.prototype.$datatables = {};

		// TODO: Remove `any` casts
		vue.component( `${ DEFAULT_DATATABLE }-cell`, VueDatatableCell as any );
		vue.component( `${ DEFAULT_DATATABLE }-header`, VueDatatableHeader as any );

		for ( const type of Object.values( this.tableTypes ) ) {
			this.installTableType( type.id );
		}
	}

	/**
	 * Declares a pair of components (a Datatable & a Datatable-Pager) sharing a config.
	 *
	 * @param id        - The base name of the datatable type.
	 * @param tableType - The configuration object that describes both datatable & the related pager.
	 * @returns `this` for chaining.
	 */
	private installTableType( id: string ): this {
		if ( !this.vueInstance ) {
			throw new Error( 'Not installed yet.' );
		}
		const tableType = this.tableTypes[id];
		// TODO: Remove `any` casts
		const tableDef = tableType.getTableDefinition();
		this.vueInstance.component( id, tableDef as any );
		const pagerDef = tableType.getPagerDefinition();
		this.vueInstance.component( id + '-pager', pagerDef as any );
		return this;
	}

	/**
	 * Remove a table type definition from vue (the datatable & its associated pager).
	 * This should be used carefully, because Vue won't be able to instanciate new instances of this table type.
	 *
	 * @param id - The base name of the datatable type to forget.
	 * @returns `this` for chaining.
	 */
	private uninstallTableType( id: string ): this {
		const components = ( this.vueInstance as any ).options.components;
		delete components[id];
		delete components[id + '-pager'];

		return this;
	}
}
