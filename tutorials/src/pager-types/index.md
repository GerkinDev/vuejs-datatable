## Introduction

The [VueDatatablePager](../classes/vuedatatablepager.html) allows you to customize the overall appearance of the paging, using the `type` property. If this property isn't set, it fallbacks to `long`.

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    To customize further the classes & HTML content of the table type, please see the <a href="./custom-theme.html">tutorial about custom themes</a>.
</div>

## Demo

<div id="demo-app">
    <div class="row">
        <div class="col-xs-3">
            <div class="form-group">
                <label for="filter">&nbsp;</label>
                <input type="text" class="form-control" v-model="filter" placeholder="Filter" @keydown="$event.stopImmediatePropagation()">
            </div>
        </div>
    </div>
    <div class="col-xs-12 table-responsive">
        <datatable :columns="columns" :data="rows" :filter="filter" :per-page="10"></datatable>
    </div>
    <section class="pagers-table">
        <label>Short</label>
        <datatable-pager v-model="page" type="short"></datatable-pager>

        <label>Abbreviated</label>
        <datatable-pager v-model="page" type="abbreviated"></datatable-pager>

        <label>Long</label>
        <datatable-pager v-model="page" type="long"></datatable-pager>
    </section>
</div>

## Code

### Typescript

```TS```

### HTML

```HTML```

<script src="{{relativeURLToRoot /assets/js/rows.js}}" defer></script>
<script id="deps"></script>
<script id="demo-script"></script>
