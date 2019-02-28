vuejs-datatable
===

A VueJS plugin to manage data tables
---

Allows for quick and easy setup of filterable, sortable, and paginated tables. Currently supports Vue.js ^2.4.

[![npm](https://img.shields.io/npm/dm/vuejs-datatable.svg)](https://www.npmjs.com/package/vuejs-datatable)
[![npm version](https://badge.fury.io/js/vuejs-datatable.svg)](https://www.npmjs.com/package/vuejs-datatable)
[![Renovate](https://badges.renovateapi.com/github/GerkinDev/vuejs-datatable)](https://renovatebot.com/)
[![Known Vulnerabilities](https://snyk.io/test/github/GerkinDev/vuejs-datatable/badge.svg?targetFile=package.json)](https://snyk.io/test/github/GerkinDev/vuejs-datatable?targetFile=package.json)
[![Build Status](https://travis-ci.com/GerkinDev/vuejs-datatable.svg?branch=master)](https://travis-ci.com/GerkinDev/vuejs-datatable)
[![Maintainability](https://api.codeclimate.com/v1/badges/824c7a7811b5fc8e39d7/maintainability)](https://codeclimate.com/github/GerkinDev/vuejs-datatable/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/824c7a7811b5fc8e39d7/test_coverage)](https://codeclimate.com/github/GerkinDev/vuejs-datatable/test_coverage)
[![GitHub commit activity the past year](https://img.shields.io/github/commit-activity/y/GerkinDev/vuejs-datatable.svg)](https://github.com/GerkinDev/vuejs-datatable)
[![license](https://img.shields.io/github/license/GerkinDev/vuejs-datatable.svg)](https://github.com/GerkinDev/vuejs-datatable/blob/master/LICENSE)

[:point_right: Browse the documentation :books:](https://vuejs-datatable.patrickstephan.me)

---

## Installation

```sh
npm install vuejs-datatable
```

OR

```sh
yarn add vuejs-datatable
```

OR

You can use the pre-compiled [*IIFE*](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) version of the component found in `dist/vuejs-datatable.js`. This will automatically register the component to `datatable`.

```html
<datatable :columns="columns" :data="rows"></datatable>


<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.js"></script>
<script src="/dist/vuejs-datatable.js"></script>
<script>
vm = new Vue({
	el: 'body',
	data: {
		columns: [...],
		rows: [...]
	}
}
</script>
```

## Usage

Register the component in your JS file using the Factory:

```js
import Vue from 'vue';
import DatatableFactory from 'vuejs-datatable';

Vue.use(DatatableFactory);
```

Use the component in your HTML or template:

```html
<datatable :columns="columns" :data="rows"></datatable>
```

Then pass in the columns and the data to your Vue instance:

```js
new Vue({
	el: '#vue-element',
	data: {
		columns: [
			{label: 'id', field: 'id'},
			{label: 'Username', field: 'user.username', headerClass: 'class-in-header second-class'},
			{label: 'First Name', field: 'user.first_name'},
			{label: 'Last Name', field: 'user.last_name'},
			{label: 'Email', field: 'user.email'},
			{label: 'address', representedAs: function(row){
				return row.address + '<br />' + row.city + ', ' + row.state;
			}, interpolate: true}
		],
		rows: [
			//...
			{
				"id": 1,
				"user": {
					"username": "dprice0",
					"first_name": "Daniel",
					"last_name": "Price",
					"email": "dprice0@blogs.com"
				},
				"address": "3 Toban Park",
				"city": "Pocatello",
				"state": "Idaho"
		    }
			//...
		]
	}
});
```

## Documentation

Browse the full documentation at [https://vuejs-datatable.patrickstephan.me](https://vuejs-datatable.patrickstephan.me).

## Attributions

* [Patrick Stephan](https://www.patrickstephan.me): Original author
* [Alexandre Germain](https://github.com/GerkinDev/): Current maintainer
