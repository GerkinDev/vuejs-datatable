## Introduction

If the processing of your rows is very expensive (like if it is fetched from an API, or requires a heavy computation), you may want to limit the number of calls to this function. For instance, if you want to automatically refresh data on text filter changes, you would avoid re-process everything on every key press.

This process of limitation is *very important* to reduce your load & improve performances, and it can be seen in two main variations:

<dl class="inlined-elements">
    <div><dt>debouncing</dt><dd>runs after a cooldown of <var>n</var> ms</dd></div>
    <div><dt>throttling</dt><dd>runs at most every <var>n</var> ms</dd></div>
</dl>

You can check out [this nice article on CSS-Tricks](https://css-tricks.com/debouncing-throttling-explained-examples/) for more informations about the difference between those kind of functions.

In this example, we use the [`_.debounce` function from *lodash*](https://lodash.com/docs/4.17.11#debounce) to call `processRows` only when the user stop typing for 1s.

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    See the ajax tutorial via <a href="./ajax-data.html">data function</a> or <a href="./ajax-handler.html">custom handlers</a> for a more detailed example of AJAX data querying.
</div>

## Demo

<div id="demo-app">
    <div class="row">
        <div class="col-xs-12 col-md-4 form-inline">
            <div class="form-group">
                <label for="filter" class="sr-only">Filter</label>
                <input type="text" class="form-control" v-model="filter" placeholder="Filter" @keydown="$event.stopImmediatePropagation()">
            </div>
        </div>
        <label for="calls-count" class="col-xs-6 col-md-4">Process count: </label>
        <output id="calls-count" class="col-xs-6 col-md-4">{{callsCount}}</output>
        <div class="col-xs-12 table-responsive">
            <datatable :columns="columns" :data="someLongOperation" :filter="filter" name="debounced" :per-page="25"></datatable>
            <datatable-pager v-model="page" table="debounced"></datatable-pager>
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
<script id="demo-script"></script>
