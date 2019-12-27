## Introduction

This plugin is built to be as versatile as possible, and allow you to inject your own HTML rendering using several [slots](https://vuejs.org/v2/guide/components-slots.html).

### Datatable

> See the [Datatable API doc](../classes/vuedatatable.html)

#### `footer` slot

This footer is displayed at the bottom of your data table.

##### Signature

| Prop | Type   | Description |
|------|--------|-------------|
| `rows` | `TRow[]` | The list of rows currently displayed by the table. It only contains the current page. |
| `columns` | [`Column[]`](../classes/column.html) | The columns of the table |
| `pagination` | [`IPageRange`](../interfaces/ipagerange.html) | An object describing the current pagination status |

##### Example

```html
<datatable>
    <template name="footer" scope="{ rows, columns, pagination }">
        <tr>
            <td :colspan="columns.length">Showing rows {{pagination.from}} to {{pagination.to}} of {{pagination.of}} items.</td>
        </tr>
    </template>
</datatable>
```

#### `default` slot

This slot is used to render each rows. It completely overrides the default row rendering process.

##### Signature

| Prop | Type   | Description |
|------|--------|-------------|
| `row` | `TRow` | The current row that it is appending to the table. |
| `index` | `number` | The current index of the row in the displayed page. |
| `columns` | `Column[]` | The [columns](../classes/column.html) of the table |

##### Example

```html
<datatable>
    <template scope="{ row, columns }">
        <tr>
            <td>{{ row.id }}</td>
            <td>{{ row.user.email }}</td>
            <td>{{ row.address + ', ' + row.city + ', ' + row.state }}</td>
        </tr>
    </template>
</datatable>
```

#### `no-results` slot

This slot is displayed if the table do not contain any rows.

##### Signature

| Prop | Type   | Description |
|------|--------|-------------|

##### Example

```html
<datatable>
    <template name="no-result">
        Nothing to see here
    </template>
</datatable>
```
