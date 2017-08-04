# Vue.js Datatable Component

Allows for quick and easy setup of filterable, sortable, and paginated tables. Currently supports Vue.js ^2.4.

## Installation

```
npm install vuejs-datatable
```

OR

```
yarn add vuejs-datatable
```

OR

You can use the pre-compiled ES5 version of the component found in `dist/vuejs-datatable.js`. This will automatically register the component to `datatable`.

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
import DatatableFactory from '../../index.js';

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
			{label: 'Username', field: 'user.username'},
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

## Datatable Properties

### columns

Here you define the label for the table headers and their corresponding row field, representation callback, or component.

#### field

```
{
	label: 'First Name',
	field: 'first_name
}
```

This will add the label "First Name" to the table header, and return the `first_name` property for each row.

You can also use deep object paths as well. If your JSON has nested objects, you can reference the nested fields:

```
rows: [
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
	},
	//...
],
columns: [
	{label: "Username", field: "user.username"}
]
```

#### representedAs

```
{
	label: 'age',
	representedAs: function(row){
		var ageDiff = Date.now() - (new Date(row.birthdate).getTime());
		var ageDate = new Date(ageDiff);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
}
```

This will run the representation callback against each row and pass the result to the cell for the corresponding label. The table will handle sorting and filtering based on the value return from the callback. If you wish to include HTML in your return value, you will need to define the `interpolate` key on the column as `true`. HTML is escaped by default.

#### component

```
Vue.component('edit-button', {
	template: `
		<button class="btn btn-xs btn-primary" @click="goToUpdatePage">Edit</button>
	`,
	props: [row],
	methods: {
		goToUpdatePage: function(){
			window.location = '/contact/' + this.row.id + '/update';
		}
	}
});
```

```
{
	label: '',
	component: 'edit-button'
}
```

This will inject the given component into the cell for the cooresponding row. The datatable will then pass each row to that component via a `row` prop. It compiles something like this:

```
<tr v-for="row in rows">
	<td v-for="column in columns">
		<component :is="column.component" :row="row"></component>
	</td>
</tr>
```

By default, components are not sortable or filterable. This is because components are registered and compiled after any filtering or sorting is done, so there is no way for the datatable to know what the plain text value of the component is. You can, however, enable filtering and sorting on the component by utilizing the `representedAs` callback.

```
{
	label: '',
	representedAs: function(row){
		return row.id;
	}
	component: 'edit-button'
}
```

#### align

This will align the text in both the header cells and the body cells as defined. Uses inline styles. Default: left.

#### sortable

This is a boolean value that determines whether or not that column can be sorted. Sorting is enabled by default on all columns except for component columns. Component columns do not currently support sorting. To disable sorting on any particular column, define `sortable` as `false`:

```
{
	label: 'Email',
	field: 'email',
	sortable: false
}
```

#### filterable

This is a boolean value that determines whether or not that column should be utilized in filtering. Filtering is enabled by default on all columns except for component columns. To disable filtering on any particular column, define `filterable` as `false`:

```
{
	label: 'Email',
	field: 'email',
	filterable: false
}
```

Filtering works such that the text in the filter input is split by white space, and each word is then checked against every filterable column. If each word appears at least once in any column, then that row passes and is displayed in the table.

### data

This is the data that is represented by each row in the table. It must be an array of objects where the key of each object is the value for your column.field entries. For example, if you have a column entry like this:

```
{
	label: 'First Name',
	field: 'first_name
}
```

Then you must have a key of `first_name` in your row objects. The entire row object will get passed to any columns that utilize callbacks or components. Your rows should look something like this:

```
[
	{
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		birthdate: '1980-01-24'
	}
]
```

### name

This allows proper association between tables and paginators when multiple of each are on a single page. The value of this field should match the value of the `table` field on its associated paginators.

### filter-by

This is the value by which you want to filter your table by. It will usually point to a variable that is bound to a text input.



## Datatable Pager Properties

### v-model

This is the current page selected.

### table

This should match the `name` attribute of the table the paginator should control. This is handled automatically for the first table on the page and can be ignored as long as no more than one table is on a page (unless for some reason you want the paginator to control both tables).

### type

This controls the type of paginator to display. 3 types are currently supported: long (default), abbreviated, and short.

### per-page

This determines how many rows should be displayed per page. Defaults to 10.

### page

This determines which page should be displayed. This attribute is required and must be associated with a variable (meaning you can just `page="1"`, you must `:page="page_variable"`) if you use a paginator.
