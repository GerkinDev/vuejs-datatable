export declare type TMaybePromise<T> = T | Promise<T>;
export declare const ensurePromise: <T>(value: TMaybePromise<T>) => Promise<T>;
export interface IDict<T> {
    [key: string]: T;
}
export declare type TClassVal = string | string[] | IDict<boolean>;
export declare const classValType: any[];
export declare const mergeClassVals: (mainObj: TClassVal, ...objs: (string | IDict<boolean> | string[] | null | undefined)[]) => string[];
export declare const namespace = "vue-datatable";
export declare const namespaceEvent: (event: string) => string;
/**
 * Enumeration of text alignment in a cell.
 */
export declare const enum EColAlign {
    Left = "left",
    Center = "center",
    Right = "right"
}
/**
 * Enumeration of the different display modes available for the pager.
 *
 * @tutorial pager-types
 */
export declare const enum EPagerType {
    Short = "short",
    Abbreviated = "abbreviated",
    Long = "long"
}
export declare const valueToString: (val: any) => string;
