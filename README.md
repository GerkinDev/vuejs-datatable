# Vue.js Datatable Component

Allows for quick and easy setup of filterable, sortable, and paginated tables. Currently supports Vue.js ^2.4.

[https://vuejs-datatable.patrickstephan.me](https://vuejs-datatable.patrickstephan.me)

## Installation

```
npm install vuejs-datatable
```

OR

```
yarn add vuejs-datatable
```

OR

You can use the pre-compiled [*IIFE*](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) version of the component found in `dist/vuejs-datatable.js`. This will automatically register the component to `datatable`.

```
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

```
import Vue from 'vue';
import DatatableFactory from 'vuejs-datatable';

Vue.use(DatatableFactory);
```

Use the component in your HTML or template:

```
<datatable :columns="columns" :data="rows"></datatable>
```

Then pass in the columns and the data to your Vue instance:

```
new Vue({
	el: '#vue-element',
	data: {
		table_columns: [
			{label: 'id', field: 'id'},
			{label: 'Username', field: 'user.username', headerClass: 'class-in-header second-class'},
			{label: 'First Name', field: 'user.first_name'},
			{label: 'Last Name', field: 'user.last_name'},
			{label: 'Email', field: 'user.email'},
			{label: 'address', representedAs: function(row){
				return row.address + '<br />' + row.city + ', ' + row.state;
			}, interpolate: true}
		],
		table_rows: [
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
