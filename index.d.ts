// Type definitions for vuejs-datatable 1.5.3
// Project: vue-datatable
// Definitions by: GerkinDev <https://github.com/gerkinDev/>

declare module 'vuejs-datatable'{
	import Vue, { PluginFunction, PluginObject } from 'vue';
	
	class DatatableFactory implements PluginObject<{}> {
		/**
		 * Declares global components exported by vuejs-datatable, & load configs.
		 * You should add table types to the {@link table_types} list before this function is called.
		 * 
		 * @param Vue - The global Vue instance.
		 */
		public install: PluginFunction<{}>;
		

		/**
		 * Controls the definition of default table type.
		 * 
		 * @param use - `true` to use the default type, false otherwise.
		 */
		useDefaultType(use: boolean): this;

		/**
		 * Creates a new table type with a specified prefix, that you can customize using a callback.
		 * 
		 * @param componentName - The name of the component to register.
		 * @param callback - An optional function to execute, that configures the newly created {@link TableType}. It takes a single parameter: the newly created {@link TableType}
		 */
		registerTableType(componentName: string, callback?: (tableType: TableType) => void): this;
	}
	const VuePlugin: DatatableFactory;
	
	export default VuePlugin;
	
	export class TableType{}
	export type HeaderComponent = any;

	export interface IDataCallbackOptions{
		/**
		 * A string representing the filter request, usually entered in a search input.
		 */
		filter?: string,
		/**
		 * The index of the current page (1-indexed).
		 */
		pageNumber: number;
		/**
		 * The expected number of items per page.
		 */
		pageLength: number;
		/**
		 * The field name used for sorting, or `null` if not sorted.
		 */
		sortBy: string | null;
		/**
		 * The order of the sort, or `null` if not sorted. 
		 */
		sortDir: 'asc' | 'desc' | null,
	}

	/**
	 * A datatable component, with its specific methods
	 * 
	 * @typeParam TRow - The type of the data item handled by the table
	 */
	export interface IVueDatatable<TRow> extends Vue {
		// Props
		name: string;
		columns: ColumnDefinitions<TRow>;
		data: (options: IDataCallbackOptions, callback: (rows: TRow[], rowCount: number) => void) => void;
		filterBy: string;
		rowClasses: null | ((row: TRow) => string) | string;

		// Data
		readonly sortBy: null | IColumnDefinition<TRow>,
		readonly sortDir: null | 'asc' | 'desc',
		readonly totalRows: number,
		readonly page: number,
		readonly perPage: null | number,
		readonly processedRows: TRow[],

		// Computed
		readonly rows: TRow[];
		readonly settings: unknown;
		readonly handler: unknown;
		readonly normalizedColumns: unknown;
		readonly tableClass: string;
		
		// Methods
		getSortDirectionForColumn(columnDefinition: IColumnDefinition<TRow>): 'asc' | 'desc';
		setSortDirectionForColumn(direction: 'asc' | 'desc', columnDefinition: IColumnDefinition<TRow>): void;
		processRows(): void;
		getRowClasses(row: TRow): string;
	}
	
	/**
	 * Description of a single column of a datatable.
	 * 
	 * @typeParam TRow - The type of the item to bind on the row
	 */
	export interface IColumnDefinition<TRow>{
		/**
		 * The alignment direction of the cells in this column.
		 * Defaults to `'left'`
		 */
		align?: 'left' | 'right' | 'center';
		/**
		 * The label displayed in the header.
		 */
		label: string;
		/**
		 * The name of the field in the row object.
		 * You can use `representedAs` for further customization
		 */
		field?: keyof TRow;
		/**
		 * Transformation function that returns the string to display
		 * 
		 * @param row TRow - The current row to transform and display
		 */
		representedAs?(row: TRow): string;
		/**
		 * Yeah I don't know what it is.
		 */
		component?:any;
		/**
		 * Set to true to convert the return value of `props.representedAs` to HTML.
		 * Defaults to `false`
		 */
		interpolate?:boolean;
		 /**
		  * Header cell component of the column.
		  */
		headerComponent?: HeaderComponent;
		/**
		 * Controls whetever this column can be sorted.
		 * The default value depend on the column configuration.
		 */
		sortable?: boolean;
		/**
		 * Controls whetever this column can be filtered.
		 * The default value depend on the column configuration.
		 */
		filterable?: boolean;
		/**
		 * The base CSS class to apply to the header component.
		 */
		headerClass?: string;
	}
	
	/**
	 * Description of all columns of a datatable.
	 * 
	 * @typeParam TRow - The type of the item to bind on the row
	 */
	export type ColumnDefinitions<TRow> = IColumnDefinition<TRow>[];
}
