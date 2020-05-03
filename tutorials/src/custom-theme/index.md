## Introduction

You can customize the appearance of your table by merging a [Settings Props object](../../../interfaces/isettingsproperties.html) in your [Table Type](../../../classes/tabletype.html), by using [TableType.mergeSettings](../../../classes/tabletype.html#mergesettings).

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    The example bellow shows a configuration using <a href="https://fontawesome.com/" target="_blank">FontAwesome icons</a>.
</div>

## Demo

<div id="demo-app">
	<div class="row">
		<div class="col-xs-12 table-responsive">
			<datatable :columns="columns" :data="rows" :per-page="10"></datatable>
			<datatable-pager v-model="page" type="short"></datatable-pager>
		</div>
	</div>
</div>

## Code

### Typescript

```TS```

### HTML

```HTML```

<script src="{{relativeURLToRoot /assets/js/rows.js}}" defer></script>
<script id="deps"></script>
<script id="demo-script"></script>
