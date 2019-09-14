## Introduction

This version of VueJS Datatable is shipped with a couple of presets for CSS framework you can use.

For now, following themes are available:

* bootstrap-3
* bootstrap-4

Once loaded, you can use the themed components named `${theme}-datatable` for the table, and `${theme}-datatable-pager` for the pager.

You can load up a theme using either

* the *ESM* version if importing it through a javascript file

	```ts
	import 'vuejs-datatable/dist/themes/bootstrap-3.esm';
	```

* the *IIFE* version if loading the theme directly, like via a CDN.

	```html
	<script src="vuejs-datatable/dist/vuejs-datatable.js" defer></script>
	<script src="vuejs-datatable/dist/themes/bootstrap-3.js" defer></script>
	```

## Demo

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    Even if you see nothing particular with the table below, you can see using your browser's inspector that it has the class <code>table</code>, which is defined by the <em>bootstrap-3</em> theme.
</div>

<div id="demo-app">
	<div class="row">
		<div class="col-xs-12 table-responsive">
			<bootstrap-3-datatable  :columns="columns" :data="rows" :filter="filter" :per-page="10"></bootstrap-3-datatable>
			<bootstrap-3-datatable-pager v-model="page"></bootstrap-3-datatable-pager>
		</div>
	</div>
	<div class="row">
	</div>
</div>

## Code

### Typescript

```TS```

### HTML

```HTML```

<script src="{{relativeURLToRoot /assets/js/rows.js}}" defer></script>
<script id="deps"></script>
<script src="{{relativeURLToRoot /assets/js/bootstrap-3.js}}" defer></script>
<script id="demo-script"></script>
