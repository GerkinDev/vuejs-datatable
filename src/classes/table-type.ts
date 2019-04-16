import { Path } from 'object-path';
import { Mixins } from 'vue-property-decorator';

import { DefaultHandler, IHandler, TDisplayHandler, TFilterHandler, TPaginateHandler, TSortHandler } from './handlers';
import { DeepPartial, ISettingsProperties, Settings } from './settings';

import { tableTypeConsumerFactory } from '../components/mixins/table-type-consumer-factory';
import { VueDatatablePager } from '../components/vue-datatable-pager/vue-datatable-pager';
import { VueDatatable } from '../components/vue-datatable/vue-datatable';

/**
 * Defines a type of Datatable, with its {@link Settings} object.
 */
export class TableType<TRow extends {}, TSource = TRow[], TFiltered = TRow[], TSorted = TRow[], TPaged = TRow[]> {
	/** Settings object used to get various values for the datatable & other components */
	public readonly settings = new Settings();

	public get tableTypeConsumer() {
		return tableTypeConsumerFactory( this as any );
	}

	/**
	 * Creates a new datatable type, instanciating a new {@link Settings} object.
	 *
	 * @param id      - The identifier of this datatable type
	 * @param handler - Transformation functions to use for table operations
	 */
	public constructor(
		public readonly id: string,
		public readonly handler: IHandler<TRow, TSource, TFiltered, TSorted, TPaged>  = new DefaultHandler<TRow>() as any,
	) {}

	/**
	 * Override the table type's handler method with the provided one. It can be used to override a single handler step, or to change the behavior of a table type at runtime.
	 *
	 * @param type    - The type of the handler (`'filter' | 'sort' | 'paginate' | 'display'`)
	 * @param closure - The new handler to set.
	 */
	private setHandler( type: 'filter', closure: TFilterHandler<TRow, TSource, TFiltered> ): this;
	private setHandler( type: 'sort', closure: TSortHandler<TRow, TFiltered, TSorted> ): this;
	private setHandler( type: 'paginate', closure: TPaginateHandler<TRow, TSorted, TPaged> ): this;
	private setHandler( type: 'display', closure: TDisplayHandler<TRow, TSource, TFiltered, TSorted, TPaged> ): this;
	private setHandler(
		type: 'filter' | 'sort' | 'paginate' | 'display',
		// tslint:disable-next-line: ban-types
		closure: Function,
	): this {
		( this.handler as any )[type + 'Handler'] = closure;
		return this;
	}

	/**
	 * Defines the function used to filter data
	 *
	 * @see Handler#filterHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use for sorting.
	 * @returns `this` for chaining.
	 */
	public setFilterHandler = ( this.setHandler as any ).bind( this, 'filter' ) as ( closure: TFilterHandler<TRow, TSource, TFiltered> ) => this;

	/**
	 * Defines the function used to sort data
	 *
	 * @see Handler#sortHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use for sorting.
	 * @returns `this` for chaining.
	 */
	public setSortHandler = ( this.setHandler as any ).bind( this, 'sort' ) as ( closure: TSortHandler<TRow, TFiltered, TSorted> ) => this;

	/**
	 * Defines the function used to paginate data
	 *
	 * @see Handler#paginateHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use for pagination.
	 * @returns `this` for chaining.
	 */
	public setPaginateHandler = ( this.setHandler as any ).bind( this, 'paginate' ) as ( closure: TPaginateHandler<TRow, TSorted, TPaged> ) => this;

	/**
	 * Defines the function used to paginate data
	 *
	 * @see Handler#displayHandler
	 * @tutorial ajax-handler
	 * @param closure - The function to use to post-process processed steps & extract rows & total count.
	 * @returns `this` for chaining.
	 */
	public setDisplayHandler = ( this.setHandler as any ).bind( this, 'display' ) as ( closure: TDisplayHandler<TRow, TSource, TFiltered, TSorted, TPaged> ) => this;

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
		// tslint:disable-next-line: max-classes-per-file
		return Mixins( VueDatatable, this.tableTypeConsumer );
	}

	/**
	 * Factory function that copy the {@link VueDatatablePager} prototype, and configure as this type.
	 *
	 * @returns a new factored {@link VueDatatablePager} constructor.
	 */
	public getPagerDefinition(): typeof VueDatatablePager {

		// tslint:disable-next-line: max-classes-per-file
		return Mixins( VueDatatablePager, this.tableTypeConsumer );
	}
}
