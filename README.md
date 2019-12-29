# vuejs-datatable

> A VueJS plugin to manage data tables

Allows for quick and easy setup of filterable, sortable, and paginated tables. Currently supports Vue.js ^2.4.

[![npm](https://img.shields.io/npm/dm/vuejs-datatable.svg)](https://www.npmjs.com/package/vuejs-datatable)
[![npm version](https://badge.fury.io/js/vuejs-datatable.svg)](https://www.npmjs.com/package/vuejs-datatable)
[![Renovate](https://badges.renovateapi.com/github/GerkinDev/vuejs-datatable)](https://renovatebot.com/)
[![Known Vulnerabilities](https://snyk.io/test/github/GerkinDev/vuejs-datatable/badge.svg?targetFile=package.json)](https://snyk.io/test/github/GerkinDev/vuejs-datatable?targetFile=package.json)
[![Build Status](https://travis-ci.com/GerkinDev/vuejs-datatable.svg?branch=master)](https://travis-ci.com/GerkinDev/vuejs-datatable)
[![Maintainability](https://api.codeclimate.com/v1/badges/824c7a7811b5fc8e39d7/maintainability)](https://codeclimate.com/github/GerkinDev/vuejs-datatable/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/824c7a7811b5fc8e39d7/test_coverage)](https://codeclimate.com/github/GerkinDev/vuejs-datatable/test_coverage)
[![GitHub commit activity the past year](https://img.shields.io/github/commit-activity/y/GerkinDev/vuejs-datatable)](https://github.com/GerkinDev/vuejs-datatable)
[![license](https://img.shields.io/github/license/GerkinDev/vuejs-datatable.svg)](https://github.com/GerkinDev/vuejs-datatable/blob/master/LICENSE)

E2E testing over Travis realized using

[<img src="https://i1.wp.com/www.diogonunes.com/blog/wp-content/uploads/2016/07/browserstack-logo.png?resize=490%2C105" height="105.6" width="490.1" class="img-responsive"/>](https://www.browserstack.com/)

[:point_right: Browse the documentation :books:](https://gerkindev.github.io/vuejs-datatable/)
[:point_right: Check out the tutorials :books:](https://gerkindev.github.io/vuejs-datatable/tutorials/index.html)

---

## Getting started

### Install the package

To install this package, simply install `vuejs-datatable` with your favorite package manager:

```sh
# Using npm
npm install vuejs-datatable
# Using yarn
yarn add vuejs-datatable
```

### Import the package

#### Use the ESM build

> The [*ESM*](https://medium.com/webpack/the-state-of-javascript-modules-4636d1774358) build (**E**cma**S**cript **M**odule) implies that your target browsers supports *ESM* **OR** you use a bundler, like [*webpack*](https://webpack.js.org/), [*rollup.js*](https://rollupjs.org/guide/en) or [*Parcel*](https://parceljs.org/).

Import & register the [*DatatableFactory*](https://gerkindev.github.io/vuejs-datatable/DatatableFactory.html) in Vue:

```js
import Vue from 'vue';
import { VuejsDatatableFactory } from 'vuejs-datatable';

Vue.use( VuejsDatatableFactory );
```

Check out [*how to customize table types*](#customize-the-datatable) to see some usage of the [*DatatableFactory*](https://gerkindev.github.io/vuejs-datatable/DatatableFactory.html) and the possible reasons not to use the default instance exported as `VuejsDatatableFactory`.

#### Use the IIFE build

> The [*IIFE*](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) build (**I**mmediately **I**nvoked **F**unction **E**xpression) should be prefered only for small applications without bundlers, or if you privilegiate the use of a *CDN*.

In your HTML, load the *IIFE* build directly, if possible right before the closing `</body>` tag. You **must** make sure that the loading order is preserved, like below.

```html
<body>
    <!-- All your page content... -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.js" defer></script>
    <script src="/dist/vuejs-datatable.js" defer></script>
    <script src="/myscript.js" defer></script>
</body>
```

The *IIFE* build exposes the [*DatatableFactory*](https://gerkindev.github.io/vuejs-datatable/DatatableFactory.html) as the global `VuejsDatatable`. Check out [*how to customize table types*](#customize-the-datatable) to see some usage of the `DatatableFactory`.

### Use the component

Use the component in your HTML or template:

```html
<div id="vue-root">
    <datatable :columns="columns" :data="rows"></datatable>
</div>
```

Then pass in the columns and the data to your Vue instance:

```js
new Vue({
    el: '#vue-root',
    data: {
        columns: [
            {label: 'id', field: 'id'},
            {label: 'Username', field: 'user.username', headerClass: 'class-in-header second-class'},
            {label: 'First Name', field: 'user.firstName'},
            {label: 'Last Name', field: 'user.lastName'},
            {label: 'Email', field: 'user.email'},
            {label: 'Address', representedAs: ({address, city, state}) => `${address}<br />${city}, ${state}`, interpolate: true}
        ],
        rows: [
            //...
            {
                id: 1,
                user: {
                    username: "dprice0",
                    firstName: "Daniel",
                    lastName: "Price",
                    email: "dprice0@blogs.com"
                },
                address: "3 Toban Park",
                city: "Pocatello",
                state: "Idaho"
            }
            //...
        ]
    }
});
```

### Customize the datatable

The DatatableFactory exposes several methods to allow you to add or modify other `datatable`-like components, with [custom styles](https://gerkindev.github.io/vuejs-datatable/tutorial-custom-theme.html) or [behavior](https://gerkindev.github.io/vuejs-datatable/tutorial-ajax-handler.html).

```js
VuejsDatatable
    .registerTableType( 'my-awesome-table', tableType => {
        tableType
            .mergeSettings( /* ... */ )
            .setFilterHandler( /* ... */ )
            .setSortHandler( /* ... */ );
    } );
```

## Documentation

Browse the full documentation at [https://gerkindev.github.io/vuejs-datatable/](https://gerkindev.github.io/vuejs-datatable/).

## Use a development version

Sometimes, you'll need to use a development version of the module. This allow you to modify source code, run tests, and build custom versions of the module.

Always existing branches are:

* [`develop`](https://github.com/GerkinDev/vuejs-datatable/tree/develop): Latest changes, not yet validated.
* [`staging`](https://github.com/GerkinDev/vuejs-datatable/tree/staging): Changes considered as stable and planned for next release.
* [`master`](https://github.com/GerkinDev/vuejs-datatable/tree/master): Releases, stable versions.

You may use other branches (for features, hotfixes, etc etc). Check out the [list of branches](https://github.com/GerkinDev/vuejs-datatable/branches).

```sh
# First, clone the repo
# replace `my-branch` with the name of the branch you want to use
git clone https://github.com/GerkinDev/vuejs-datatable.git#my-branch
# Go to the repo directory
cd vuejs-datatable
# Install dependencies
npm install
# Run tests
npm run test
# Build the package
npm run build
```

Optionaly, [link your local modules](https://docs.npmjs.com/cli/link.html) so you can use it in other modules.

> You may need to run the following command as `sudo`

```sh
npm link
```

## Attributions

* [Patrick Stephan](https://www.patrickstephan.me): Original author
* [Alexandre Germain](https://github.com/GerkinDev/): Current maintainer
