# Vue.js Datatable Component

Allows for quick and easy setup of filterable, sortable, and paginated tables. Currently supports both Vue.js 1 and Vue.js 2.

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
<datatable :columns="columns" :rows="rows" paginate filterable></datatable>


<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.28/vue.js"></script>
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

Register the component in your JS file:

```
Vue.component('datatable', require('vuejs-datatable'));
```

Use the component in your HTML or template:

```
<datatable :columns="table_columns": :data="table_rows" filterable paginate></datatable>
```

Then pass in the columns and the data to your Vue instance:

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

new Vue({
	el: '#vue-element',
	data: {
		table_columns: [
			label: 'First Name', field: 'first_name',
			label: 'Last Name', field: 'last_name',
			label: 'Email', field: 'email',
			label: 'age', callback: function(row){
				var ageDiff = Date.now() - (new Date(row.birthdate).getTime());
				var ageDate = new Date(ageDiff);
				return Math.abs(ageDate.getUTCFullYear() - 1970);
			},
			label: '', component: 'edit-button',
		],
		table_rows: []
	}
});
```

## Properties

### columns

Here you define the label for the table headers and their cooresponding row field, callback or component.

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

#### callback

```
{
	label: 'age',
	callback: function(row){
		var ageDiff = Date.now() - (new Date(row.birthdate).getTime());
		var ageDate = new Date(ageDiff);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
}
```

This will run the callback against each row and pass the result to the cell for the cooresponding label.

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

This is a boolean value that determines whether or not that column should be utilized in filtering. Filtering is enabled by default on all columns except for component columns. Component columns do not currently support filtering. To disable filtering on any particular column, define `filterable` as `false`:

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

### filterable

This is a boolean flag that denotes whether you want to expose a field that allows the user to type to filter through rows.

### paginate

This is a boolean flag that denotes whether you want to paginate the rows in your table.

### size-options

Allows you to determine what page sizes to allow the user to choose when viewing the table.

### data-store

Allows you to overwrite the logic for your own custom datastore. An example would be for an ajax table. See the Ajax example for reference.

### filter-bar (NO LONGER SUPPORTED AS OF 0.7.0)

If you want to customize the display or functionality of the filter/pagination bar, you can register a custom global component and pass it's name here. Then the datatable will utilize your custom component instead of the default one. It will require the following props:

* rows: a list of objects representing the entries to be displayed in the table
* filterable: a boolean value determining whether or not to utilize filtering
* paginate: a boolean value determining wheter or not to utilize pagination

It will also need to supply a `change` event that will pass back the filtered and paginate rows. This should occur whenever pagination or filtering has taken place.