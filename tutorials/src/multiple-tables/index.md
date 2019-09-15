## Introduction

Datatable and pager can be associated with each other using the [VueDatatable.name](../classes/vuedatatable.html#name) &amp; [VueDatatablePager.table](../classes/vuedatatablepager.html#table) property. Simply set the same value for both properties, and the pager will control the associated table.

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    Check out the <a href="./pager-styles.html">Pager styles tutorial</a> to see the different aspects available for the pager.<br/>
    If you want to dynamically generate names from the host component, you can use the <code>$vnode.tag</code> property <em>(TODO: Find a link or reference explaining what is this property, exactly... If you got a reference, please post a PR ;) )</em>.
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-circle"></i>
    If the relation between the table and the pager is broken, the table will be displayed in <em><a href="./no-pager.html">no pager</a></em> mode.
</div>

## Demo

<div id="demo-app">
    <div class="row">
        <div class="col-xs-12 form-inline">
            <div class="form-group">
                <label for="filter" class="sr-only">Filter</label>
                <input type="text" class="form-control" v-model="filter" placeholder="Filter" @keydown="$event.stopImmediatePropagation()">
            </div>
        </div>
        <div class="col-xs-12 table-responsive">
            <datatable :columns="columns" :data="rows" :filter="filter" :per-page="10"></datatable>
            <datatable-pager v-model="page"></datatable-pager>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 form-inline">
            <div class="form-group">
                <label for="filter" class="sr-only">Filter</label>
                <input type="text" class="form-control" v-model="filter2" placeholder="Filter" @keydown="$event.stopImmediatePropagation()">
            </div>
        </div>
        <div class="col-xs-12 table-responsive">
            <datatable name="second" :columns="columns" :data="rows" :filter="filter2" :per-page="10"></datatable>
            <datatable-pager table="second" v-model="page2"></datatable-pager>
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
