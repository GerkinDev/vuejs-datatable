## Introduction

You can customize the tempplate of the row by using the `default` [slot](https://vuejs.org/v2/guide/components-slots.html) in the Datatable component.

This slot uses 2 variables:

1. `row`: The data object representing the current row.
2. `columns`: The array of [columns](../classes/column.html) of this datatable.

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
            <datatable :columns="columns" :data="rows" :filter="filter" :per-page="10">
                <template scope="{ row }">
                    <tr>
                        <td>{{ row.id }}</td>
                        <td>{{ row.user.username }}</td>
                        <td>{{ row.user.first_name }}</td>
                        <td>{{ row.user.last_name }}</td>
                        <td>{{ row.user.email }}</td>
                        <td>{{ row.address + ', ' + row.city + ', ' + row.state }}</td>
                    </tr>
                    <tr>
                        <td colspan="7">
                            <p>Some cool content here!</p>
                        </td>
                    </tr>
                </template>
            </datatable>
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
