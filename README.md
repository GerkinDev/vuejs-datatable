# Vue.js Datatable Component

Allows for quick and easy setup of filterable and paginated tables.

## Installation

```
npm install vuejs-datatable
```

OR

```
yarn add vuejs-datatable
```

## Usage

Register the component in your JS file:

```
Vue.component('datatable', require('vuejs-datatable'));
```

Use the component in your HTML or template:

```
<datatable :columns="table_columns": :rows="table_rows" filterable paginate></datatable>
```

Then pass in the columns and the rows to your Vue instance:

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

### rows

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

### page-size

An integer that denotes how many rows you want to display on each page.