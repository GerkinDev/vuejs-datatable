# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-alpha.7](https://github.com/GerkinDev/vuejs-datatable/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2019-12-29)

## [2.0.0-alpha.6](https://github.com/GerkinDev/vuejs-datatable/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2019-12-16)

## [2.0.0-alpha.5](https://github.com/GerkinDev/vuejs-datatable/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2019-12-02)

## [2.0.0-alpha.4](https://github.com/GerkinDev/vuejs-datatable/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2019-11-21)

## [2.0.0-alpha.3](https://github.com/GerkinDev/vuejs-datatable/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2019-09-29)

## [2.0.0-alpha.2](https://github.com/GerkinDev/vuejs-datatable/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2019-09-15)

# [2.0.0-alpha.1](https://github.com/GerkinDev/vue-datatable/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2019-03-12)



# [2.0.0-alpha.0](https://github.com/GerkinDev/vue-datatable/compare/v1.7.0...v2.0.0-alpha.0) (2019-03-12)


### Bug Fixes

* 🐛 Avoid double `processRows` on linking a pager to a table ([0e32691](https://github.com/GerkinDev/vue-datatable/commit/0e32691)), closes [#32](https://github.com/GerkinDev/vue-datatable/issues/32) [#52](https://github.com/GerkinDev/vue-datatable/issues/52)
* 🐛 Column fix with non-string alignment, test fixes ([7931877](https://github.com/GerkinDev/vue-datatable/commit/7931877))
* 🐛 Ensure return values from handler fns are Promises ([2a45865](https://github.com/GerkinDev/vue-datatable/commit/2a45865))
* 🐛 fix total page count & change emission on Pager ([1e8cda8](https://github.com/GerkinDev/vue-datatable/commit/1e8cda8)), closes [#27](https://github.com/GerkinDev/vue-datatable/issues/27)
* 🐛 Fixed cell representation interpolation ([f687be1](https://github.com/GerkinDev/vue-datatable/commit/f687be1))
* 🐛 Fixed required IColumnDefinition fields wrongly required ([8e6f1d7](https://github.com/GerkinDev/vue-datatable/commit/8e6f1d7))
* 🐛 Fixed the pager component name ([ed34cb9](https://github.com/GerkinDev/vue-datatable/commit/ed34cb9))
* 🐛 Handler.paginateHandler skipped with incorrect page args ([f3fb71e](https://github.com/GerkinDev/vue-datatable/commit/f3fb71e))
* 🐛 Pager: Do not show next/prev when on first/last page ([a414eda](https://github.com/GerkinDev/vue-datatable/commit/a414eda))
* 🐛 Register/deregister table types after install for IIFE ([288b37f](https://github.com/GerkinDev/vue-datatable/commit/288b37f))
* 🐛 Remove type constraint on `Datatable.data` ([6b1ea0e](https://github.com/GerkinDev/vue-datatable/commit/6b1ea0e))
* 🐛 Restored `Handler.displayHandler`, and rework signature ([87b8357](https://github.com/GerkinDev/vue-datatable/commit/87b8357))
* 🐛 Settings: Fixed error when merging unexistent props path ([2b7c950](https://github.com/GerkinDev/vue-datatable/commit/2b7c950))
* 🐛 TableType now `clone` correctly returns function as-is ([5d9b553](https://github.com/GerkinDev/vue-datatable/commit/5d9b553))
* 🐛 Watch `sortBy` object directly, not its string cast ([b14707b](https://github.com/GerkinDev/vue-datatable/commit/b14707b)), closes [#48](https://github.com/GerkinDev/vue-datatable/issues/48)


### Code Refactoring

* 💡 Add support of async handlers for rows processing ([b967341](https://github.com/GerkinDev/vue-datatable/commit/b967341))
* 💡 Column: `isSortable` & `isFilterable as static ([37348c3](https://github.com/GerkinDev/vue-datatable/commit/37348c3))
* 💡 Factory can now register & deregister table types ([278ca60](https://github.com/GerkinDev/vue-datatable/commit/278ca60))
* 💡 Removed `getValue` on Column ([54904f1](https://github.com/GerkinDev/vue-datatable/commit/54904f1))
* 💡 Rework Handler class, removed `displayHandler` ([e90fd9f](https://github.com/GerkinDev/vue-datatable/commit/e90fd9f))
* 💡 Rework TableType, shortened class implementation ([59eb710](https://github.com/GerkinDev/vue-datatable/commit/59eb710))


### Features

* 🎸 Added Typescript types for columns & datatable comp ([22d9ad8](https://github.com/GerkinDev/vue-datatable/commit/22d9ad8))
* 🎸 Allow the package to be installed via git ([8e15217](https://github.com/GerkinDev/vue-datatable/commit/8e15217))
* 🎸 Expose the default factory as `VuejsDatatable` for IIFE ([28291b7](https://github.com/GerkinDev/vue-datatable/commit/28291b7)), closes [#51](https://github.com/GerkinDev/vue-datatable/issues/51)
* 🎸 Factory: `useDefaultType` returns the state if no param ([0f4f83f](https://github.com/GerkinDev/vue-datatable/commit/0f4f83f))
* 🎸 Header cell click event moved, use plain HTML for icon ([c4019ff](https://github.com/GerkinDev/vue-datatable/commit/c4019ff)), closes [#35](https://github.com/GerkinDev/vue-datatable/issues/35) [#26](https://github.com/GerkinDev/vue-datatable/issues/26)


### Styles

* 💄 Lint the whole codebase ([5c44cf3](https://github.com/GerkinDev/vue-datatable/commit/5c44cf3))


### BREAKING CHANGES

* Changed signature of display handler, changed `filterBy` to `filter`,
changed `processedRows` to `displayedRows`.
* Replaced `TableType.getId` method with `TableType.id` getter, removed
`TableType.setDisplayHandler`
* Removed `displayHandler`.
* Removed `Factory.defaultTableSettings`. The default table type settings
can no more be customized at the factory-level
* Removed `Column.GetValue`
* Column: `isSortable` & `isFilterable` were changed from instance methods
to static methods, because they do
not use instance props or methods.
* All properties & methods were renamed from `snake_case` to `camelCase`



## [1.7.0] - 2018-09-28 y6uj

### Changed

 - Using Rollup instead of Laravel Mix/Webpack for building scripts.

## [1.6.0] - 2018-09-12

### Added

 - Added ability to add classes to the table header cells.

## [1.5.5] - 2018-09-12

### Bugfixes

 - Added `:key` attribute to iterated element.

## [1.5.4] - 2018-09-12

### Bugfixes

 - Fixed issue where Vue is not defined when Vue is not available globally.

## [1.5.3] - 2018-02-21

### Added

 - Added normalized columns to the table row slot.

## [1.5.2] - 2018-02-20

### Bugfixes

 - Fixed issue where scoping the footer slot would break the table footer.

## [1.5.1] - 2018-02-17

### Bugfixes

 - Hide the `tfoot` tag if no footer slot content was provided

## [1.5.0] - 2018-02-17

### Added

 - Added the ability to use a custom footer

## [1.4.0] - 2018-02-16

### Added

 - Added the ability to set a custom component for a column header.

## [1.3.1] - 2017-10-11

### Bugfixes

 - Fixed issue where changing the pager's page length doesn't trigger an update on the table.

## [1.3.0] - 2017-10-10

### Added

 - Support to apply classes to rows on the datatable as a whole or individually.

## [1.2.0] - 2017-10-04

### Added

 - Support for a function to be used in the datatable `data` param. This function will be used to process the rows to display
 - Support for displaying content when no row are shown in the datatable.

## [1.1.0] - 2017-10-02

### Added

 - Support in settings for classes on the pager `li` and `a` tags (This adds better support for Bootstrap 4).
 - Ability to overrided default table settings via `DatatableFactory.default_table_settings`.
 - Logic for updating components in tests.
 - Support for NPM's `link` functionality for local development.

### Bugfixes

 - Added list-render keys to the `datatable head` and body cells.
 - Added list-render keys to the `datatable-pager` buttons.
 - Added active class to "current page" pager button in the short style pager.

## [1.0.0] - 2017-08-04

### Added

 - 3 Total pagination types: long (default), abbreviated, and short. [Pager examples](examples/pager-styles/index.html)
 - You can now customize the classes used by the table. It uses Bootstrap 3 by default, but can be changed manually. This currently requires you to transpile your own JS. [Custom theme example](examples/custom-theme/app.js)
 - TESTS!
 - The ability to completely override the table row output via slot template override. [Custom template example](examples/custom-template/app.js)

### Changed

 - Dropped support for Vue.js 1. Minimum required version is now 2.4
 - Almost entire rebuild. Old syntax for datatables is largely incompatible with new syntax
 - Changed the way logic customizations are made. Stores no longer exist. A handler has been added in their place. You can customize the logic in the handlers. [AJAX example](examples/ajax/app.js)
 - Pagination is now handled outside of the datatable by it's own (included) component (see the [basic](examples/basic/index.html) example). This allows you to place pagination wherever you want.
 - When multiple tables exist on a page, you must specify the link between paginators and their table. This is handled automatically for the first table and any paginators on a page. For additional tables and their associate paginators, a link must be established by adding a `name` attribute to the table and a `table` attribute on the paginator, both with the same value. [Multiple tables example Examples](examples/multiple-tables/index.html)
