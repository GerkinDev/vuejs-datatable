## Introduction

Here is the bare minimum example to use __vuejs-datatable__. You can check out other tutorials for more advanced usages.

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
            <datatable :columns="columns" :data="rows" :filter="filter" :per-page="25"></datatable>
            <datatable-pager v-model="page"></datatable-pager>
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
