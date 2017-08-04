# Changelog
All notable changes to this project will be documented in this file from 1.0.0 forward (2017-08-04).

This project will adhere as close as reasonably possible to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
