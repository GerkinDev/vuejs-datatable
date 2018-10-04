# Changelog
All notable changes to this project will be documented in this file from 1.0.0 forward (2017-08-04).

This project will adhere as close as reasonably possible to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
