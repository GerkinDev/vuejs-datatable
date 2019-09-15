## Introduction

You can customize a single [VueDatatable](../../classes/vuedatatable.html) by providing a *data function* instead of the normal array of objects. This function should be a valid [TDataFn](../../globals.html#tdatafn).

<div class="alert alert-info">
	<i class="fas fa-info-circle"></i>
	If you want to customize the behavior of <b>multiple tables</b>, you may want to check how to <a href="./ajax-handler.html">use custom handlers</a>. You may also want to <a href="./limit-rows-processing.html">debounce your data processing</a> to avoid requests spamming.
</div>

## Demo

<div id="demo-app">
	<div class="row">
		<div class="col-xs-12 table-responsive">
			<datatable :columns="columns" :data="getData"></datatable>
			<datatable-pager v-model="page"></datatable-pager>
		</div>
	</div>
</div>

## Code

### Typescript

```TS```

### HTML

```HTML```

<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js" integrity="sha256-mpnrJ5DpEZZkwkE1ZgkEQQJW/46CSEh/STrZKOB/qoM=" crossorigin="anonymous" defer></script>
<script id="deps"></script>
<script id="demo-script"></script>
