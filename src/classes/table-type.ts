import { Path } from 'object-path';

import { DefaultHandler, TDisplayHandler, TFilterHandler, TPaginateHandler, TSortHandler } from './handlers';
import { DeepPartial, ISettingsProperties, Settings } from './settings';

import { VueDatatablePager } from '../components/vue-datatable-pager/vue-datatable-pager';
import { VueDatatable } from '../components/vue-datatable/vue-datatable';

/**
 * Defines a type of Datatable, with its {@link Settings} object.
 */
export class TableType {
	/** Handler associated with the table type */
	private readonly handler = new DefaultHandler();
	/** Settings object used to get various values for the datatable & other components */
	private readonly settings = new Settings();

	/**
	 * Creates a new datatable type, instanciating a new {@link Settings} object.
	 *
	 * @param id - The identifier of this datatable type
	 */
	public constructor( public readonly id: string ) {}

	/**
	 * Defines the function used to filter data
	 *
	 * @see Handler#filterHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use for sorting.
	 * @returns `this` for chaining.
	 */
	public setFilterHandler( closure: TFilterHandler<any> ): this {
		this.handler.filterHandler = closure;

		return this;
	}

	/**
	 * Defines the function used to sort data
	 *
	 * @see Handler#sortHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use for sorting.
	 * @returns `this` for chaining.
	 */
	public setSortHandler( closure: TSortHandler<any> ): this {
		this.handler.sortHandler = closure;

		return this;
	}

	/**
	 * Defines the function used to paginate data
	 *
	 * @see Handler#paginateHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use for pagination.
	 * @returns `this` for chaining.
	 */
	public setPaginateHandler( closure: TPaginateHandler<any> ): this {
		this.handler.paginateHandler = closure;

		return this;
	}

	/**
	 * Defines the function used to paginate data
	 *
	 * @see Handler#displayHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use to post-process processed steps & extract rows & total count.
	 * @returns `this` for chaining.
	 */
	public setDisplayHandler( closure: TDisplayHandler<any> ): this {
		this.handler.displayHandler = closure;

		return this;
	}

	/**
	 * Set a {@link Settings} value at a specific path.
	 *
	 * @param path  - Path to the setting value to set.
	 * @param value - Value to set at the specified path.
	 * @returns `this` for chaining.
	 */
	public setting( path: Path, value: any ): this;
	/**
	 * Get a {@link Settings} value at a specific path.
	 *
	 * @param path - Path to the setting value to get.
	 * @returns the value at the given path.
	 */
	public setting( path: Path ): any;
	public setting( path: Path, value?: any ): this | any {
		if ( value === undefined ) {
			return this.settings.get( path );
		}

		this.settings.set( path, value );

		return this;
	}

	/**
	 * Merge a settings object with the {@link TableType#settings} object of the instance.
	 *
	 * @param settings - Values to merge.
	 * @returns `this` for chaining.
	 */
	public mergeSettings( settings: DeepPartial<ISettingsProperties> ): this {
		this.settings.merge( settings );

		return this;
	}

	/**
	 * Factory function that copy the {@link VueDatatable} prototype, and configure as this type.
	 *
	 * @returns a new factored {@link VueDatatable} constructor.
	 */
	public getTableDefinition(): typeof VueDatatable {
		const that = this;

		// tslint:disable-next-line: max-classes-per-file
		return class SubTable<TRow> extends VueDatatable<TRow, SubTable<TRow>> {
			public static handler = that.handler;
			public static settings = that.settings;
			public static identifier = that.id;
		};
	}

	/**
	 * Factory function that copy the {@link VueDatatablePager} prototype, and configure as this type.
	 *
	 * @returns a new factored {@link VueDatatablePager} constructor.
	 */
	public getPagerDefinition(): typeof VueDatatablePager {
		const that = this;

		// tslint:disable-next-line: max-classes-per-file
		return class SubPager extends VueDatatablePager<SubPager> {
			public static settings = that.settings;
			public static identifier = `${ that.id }-pager`;
		};
	}

	/**
	 * Deep clone a value
	 *
	 * @param obj - The value to clone
	 * @returns the clone of the original parameter.
	 */
	public static clone<T>( obj: T ): T {
		// Handle Array
		if ( obj instanceof Array ) {
			return obj.map( v => this.clone( v ) ) as any;
		}
		if ( obj instanceof Function ) {
			return obj;
		}

		// Handle Object
		if ( obj instanceof Object ) {
			const copy: any = {};

			for ( const attr in obj ) {
				if ( obj.hasOwnProperty( attr ) ) {
					copy[attr] = this.clone( obj[attr] );
				}
			}

			return copy;
		}

		return obj;
	}
}
