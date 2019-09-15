import { Path } from 'object-path';
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
export declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer V> ? ReadonlyArray<DeepPartial<V>> : DeepPartial<T[P]>;
};
/**
 * @summary Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * @description Settings class used by Datatable's components to get various values, such as class names, labels, icons, etc etc.
 * Create a new instance of this class & customize it to use different CSS frameworks.
 * No default style is set. See [[tutorial:custom-theme]] for more infos on customizing styles.
 * To edit settings contained by an instance of this class, either edit the [[Settings.properties]] object, or use the [[Settings.merge]] method.
 *
 * @tutorial custom-theme Cutomize your tables for another CSS framework or your own styling.
 */
export declare class Settings {
    /** Tree of settings values. */
    private properties;
    /**
     * Get a value at a specific path.
     *
     * @param path - Path to the value to get.
     * @returns the value at the specified path
     */
    get(path: Path): any;
    /**
     * Defines a value at a specific path
     *
     * @param path  - Path to the value to set.
     * @param value - New value to set.
     * @returns `this` for chaining.
     */
    set(path: Path, value: any): this;
    /**
     * Merges a new settings object within the Settings instance.
     *
     * @param settings - New settings object to merge with the current object of the Settings instance.
     * @returns `this` for chaining.
     */
    merge(settings: DeepPartial<ISettingsProperties>): this;
    /**
     * Merges two objects deeply, and return the 1st parameter once transformed.
     *
     * @param obj1 - The base item to merge, which will be returned.
     * @param obj2 - The object to inject into `obj1`.
     * @returns The first object once merged.
     */
    static mergeObjects<T>(obj1: T, obj2: DeepPartial<T>): T;
}
