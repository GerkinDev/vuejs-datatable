## Introduction

You can create a custom [Table Type](../classes/tabletype.html) dedicated to AJAX-sourced data. This approach has the advantage of being totally reuasble, while the [AJAX via data function](./ajax-data.html) may be less reuasble across multiple table instances.

The example bellow reuses 2 times the same logic, changing only the `data` parameter to a different endpoint.

<div class="alert alert-info">
	<i class="fas fa-info-circle"></i>
	If you want to customize the behavior of your table for a <b>single use</b>, you may want to check the use of <a href="./ajax-data.html">the <code>data</code> function</a>. You may also want to <a href="./limit-rows-processing.html">debounce your data processing</a> to avoid requests spamming.
</div>

## Demo

<div id="demo-app">
	<div class="row">
		<div class="col-xs-12 table-responsive">
			<h3>Past launches</h3>
			<ajaxtable :columns="columns" :data="apiUrlPast" name="pastLaunches" :per-page="10"></ajaxtable>
			<datatable-pager table="pastLaunches"></datatable-pager>
		</div>
		<div class="col-xs-12 table-responsive">
			<h3>Upcoming launches</h3>
			<ajaxtable :columns="columns" :data="apiUrlUpcoming" name="upcomingLaunches" :per-page="10"></ajaxtable>
			<datatable-pager table="upcomingLaunches"></datatable-pager>
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
