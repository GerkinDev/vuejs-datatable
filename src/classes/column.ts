import { get, Path } from 'object-path';
import { Vue } from 'vue-property-decorator';

export enum EColAlign {
	Left = 'left',
	Center = 'center',
	Right = 'right',
}

/**
 * Description of a single column of a datatable.
 *
 * @typeParam TRow - The type of the item to bind on the row
 */
export interface IColumnDefinition<TRow> {
	/**
	 * The alignment direction of the cells in this column.
	 * Defaults to `'left'`
	 */
	align?: EColAlign;
	/**
	 * The alignment direction of the header of this column.
	 * Defaults to `'center'`
	 */
	headerAlign?: EColAlign;
	/**
	 * The label displayed in the header.
	 */
	label: string;
	/**
	 * The name of the field in the row object.
	 * You can use `representedAs` for further customization
	 */
	field?: keyof TRow | Path;
	/**
	 * Transformation function that returns the string to display
	 *
	 * @param row TRow - The current row to transform and display
	 */
	representedAs?( row: TRow ): string;
	/**
	 * The component used to represent this cell
	 */
	component?: Vue;
	/**
	 * Set to true to convert the return value of `props.representedAs` to HTML.
	 * Defaults to `false`
	 */
	interpolate?: boolean;
	 /**
	  * Header cell component of the column.
	  */
	headerComponent?: Vue;
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
 * A class responsible for handling a full column with its header.
 */
export class Column<TRow extends {}> {
	/** The alignment direction of the cells in this column. */
	public readonly align!: EColAlign;
	/** The component used to represent this cell. */
	private readonly component?: Vue;
	/** The name of the field in the row object. */
	public readonly field?: keyof TRow | Path;
	/** A transformation function that returns the string to display */
	private readonly representedAs?: ( row: TRow ) => string;
	/** Set to true to convert the return value of `props.representedAs` to HTML. */
	private readonly interpolate = false;
	/** The alignment direction of the header of this column. */

	private readonly headerAlign!: EColAlign;
	/** The header cell component of the column. */
	private readonly headerComponent?: Vue;
	/** The base CSS class to apply to the header component. */
	private readonly headerClass = '';
	/** The label displayed in the header. */
	private readonly label = '';

	/** Controls whetever this column can be sorted. */
	public readonly sortable: boolean;
	/** Controls whetever this column can be filtered. */
	public readonly filterable: boolean;

	public constructor( props: IColumnDefinition<TRow> ) {
		Object.assign( this, props, {
			align: Column.normalizeAlignment( props.align, EColAlign.Left ),
			headerAlign: Column.normalizeAlignment( props.headerAlign, EColAlign.Center ),
		} );

		this.sortable = Column.isSortable( props );
		this.filterable = Column.isFilterable( props );
	}

	/**
	 * Normalize the alignment, using the requested default value.
	 *
	 * @param align        - The raw desired alignment
	 * @param defaultAlign - The default alignment to use, if the 1st parameter isn't recognized
	 * @returns the normalized alignment
	 */
	public static normalizeAlignment( align: string | EColAlign | undefined, defaultAlign = EColAlign.Left ): EColAlign {
		if ( typeof align === 'string' ) {
			const lowerAlign = ( align || defaultAlign ).toLowerCase();
			if ( [ 'left', 'center', 'right' ].includes( lowerAlign ) ) {
				return lowerAlign as EColAlign;
			}
		}
		return defaultAlign.toLowerCase() as EColAlign;
	}

	/**
	 * Check if the column use plain text value (eg `representedAs` or `field`, but not `component`)
	 * If multiple representation props are provided, it is considered as plain text if there are alternatives to `component`
	 *
	 * @param props - The column definition object
	 * @returns `true` if the column can be represented by plain text, `false` otherwise
	 */
	public static isPlainTextField( props: IColumnDefinition<any> ): boolean {
		return !!( props.field || props.representedAs );
	}

	/**
	 * Check if the column can be filtered.
	 *
	 * @param props - The column definition object
	 * @returns `true` if the column can be filtered, `false` otherwise
	 */
	public static isFilterable( props: IColumnDefinition<any> ): boolean {
		// If the option is explicitly disabled, use it
		if ( !props.filterable ) {
			return false;
		}

		return this.isPlainTextField( props );
	}

	/**
	 * Check if the column can be sorted.
	 *
	 * @param props - The column definition object
	 * @returns `true` if the column can be sorted, `false` otherwise
	 */
	public static isSortable( props: IColumnDefinition<any> ): boolean {
		// If the option is explicitly disabled, use it
		if ( !props.sortable ) {
			return false;
		}

		return this.isPlainTextField( props );
	}

	/**
	 * Converts a row to its string representation for the current column.
	 *
	 * @param row - The row to convert
	 * @returns the string representation of this row in the current column.
	 */
	public getRepresentation( row: TRow ): string {
		if ( this.representedAs && typeof this.representedAs === 'function' ) {
			return this.representedAs( row );
		}

		if ( !this.field ) {
			return '';
		}

		return get( row, this.field.toString() );
	}

	/**
	 * Check if the provided row's representation matches a certain filter string.
	 *
	 * @param row          - The row to check.
	 * @param filterString - The filter string to test.
	 * @returns `true` if the row matches the filter, `false` otherwise.
	 */
	public matches( row: TRow, filterString: string ): boolean {
		const colRepresentation = ( `${  this.getRepresentation( row )  }` ).toLowerCase();

		return colRepresentation.indexOf( filterString.toLowerCase() ) > -1;
	}
}
