## Introduction

The [VueDatatablePager](../classes/vuedatatablepager.html) is the component in charge of controling pagination of a [VueDatatable](../classes/vuedatatable.html).

If you do not link a [VueDatatablePager](../classes/vuedatatablepager.html) to your [VueDatatable](../classes/vuedatatable.html), then the table will show all rows without pagination, without taking into account the `per-page` prop.

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    Check out the <a href="./pager-types.html">Pager types tutorial</a> to see the different aspects available for the pager. You can also learn more on how to manage <a href="./multiple-tables.html">multiple tables</a> with pagers on the same page.
</div>

## Demo

<div id="demo-app" style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
    <div class="row">
        <div class="col-xs-12 form-inline">
            <div class="form-group">
                <label for="filter" class="sr-only">Filter</label>
                <input type="text" class="form-control" v-model="filter" placeholder="Filter" @keydown="$event.stopImmediatePropagation()">
            </div>
        </div>
        
        <div class="col-xs-12 table-responsive">
            <datatable :columns="columns" :data="rows" :filter="filter" :per-page="10"></datatable>
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
