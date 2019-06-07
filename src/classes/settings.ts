import { get, Path, set } from 'object-path';

/**
 * @tutorial custom-theme
 */
export interface ISettingsProperties {
	/** The classes to apply on the `table` tag itself. */
	table: {
		class: string;
		row: {
			/** The classes to apply on each row (`tr` tag). */
			class: string;
		};
		sorting: {
			/** The HTML representing the sort icon when the column isn't sorted. */
			sortNone: string;
			/** The HTML representing the sort icon when sorting the column ascending. */
			sortAsc: string;
			/** The HTML representing the sort icon when sorting the column descending. */
			sortDesc: string;
		};
	};
	pager: {
		classes: {
			/** The class to apply on the pager's `ul` tag. */
			pager: string;
			/** The class to apply on the page's `li` tag. */
			li: string;
			/** The class to apply on the current page's `li` tag. */
			selected: string;
			/** The class to apply on a disabled page's `li` tag. */
			disabled: string;
		};
		icons: {
			/** The HTML representing the *Previous page* icon. */
			previous: string;
			/** The HTML representing the *Next page* icon. */
			next: string;
		};
	};
}
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
	  ? Array<DeepPartial<U>>
	  : T[P] extends ReadonlyArray<infer V>
		? ReadonlyArray<DeepPartial<V>>
		: DeepPartial<T[P]>
  };

/**
 * @summary Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * @description Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * Create a new instance of this class & customize it to use different CSS frameworks.
 * The default Settings is for *Bootstrap 3/4* with *glyphicon*.
 * To edit settings contained by an instance of this class, either edit the [[Settings.properties]] object, or use the [[Settings.merge]] method.
 *
 * @tutorial custom-theme Cutomize your tables for another CSS framework or your own styling.
 */
export class Settings {
	/** Tree of settings values. */
	private properties: ISettingsProperties = {
		table: {
			class: 'table table-hover table-striped',
			row:   {
				class: '',
			},
			sorting: {
				sortAsc:  '↓',
				sortDesc: '↑',
				sortNone: '↕',
			},
		},

		pager: {
			classes: {
				disabled: 'disabled',
				li:       '',
				pager:    'pagination',
				selected: 'active',
			},
			icons: {
				next:     '&gt;',
				previous: '&lt;',
			},
		},
	};

	/**
	 * Get a value at a specific path.
	 *
	 * @param path - Path to the value to get.
	 * @returns the value at the specified path
	 */
	public get( path: Path ): any {
		return get( this.properties, path );
	}

	/**
	 * Defines a value at a specific path
	 *
	 * @param path  - Path to the value to set.
	 * @param value - New value to set.
	 * @returns `this` for chaining.
	 */
	public set( path: Path, value: any ): this {
		set( this.properties, path, value );

		return this;
	}

	/**
	 * Merges a new settings object within the Settings instance.
	 *
	 * @param settings - New settings object to merge with the current object of the Settings instance.
	 * @returns `this` for chaining.
	 */
	public merge( settings: DeepPartial<ISettingsProperties> ): this {
		this.properties = Settings.mergeObjects( this.properties, settings );

		return this;
	}

	/**
	 * Merges two objects deeply, and return the 1st parameter once transformed.
	 *
	 * @param obj1 - The base item to merge, which will be returned.
	 * @param obj2 - The object to inject into `obj1`.
	 * @returns The first object once merged.
	 */
	public static mergeObjects<T>( obj1: T, obj2: DeepPartial<T> ): T {
		for ( const key in obj2 ) {
			if ( typeof obj2[key] === 'object' ) {
				obj1[key] = Settings.mergeObjects( obj1[key] || {} as any, obj2[key] as any ) as any;
			} else {
				obj1[key] = obj2[key] as any;
			}
		}

		return obj1;
	}
}
