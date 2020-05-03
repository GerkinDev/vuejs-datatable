## Common issues

### All bundlers

### `Unknown custom element: <datatable-header> - did you register the component correctly? For recursive components, make sure to provide the "name" option.`

This usually means that *vuejs-datatable* is not correctly installed on the instance of *vue* you are trying to use.

#### If you are using the IIFE build

Make sure that your application is not shipping its own copy of *vue*. Scripts should be loaded in the following order:

1. Vue
2. Vuejs-datatable
3. Your application code

#### If you are using the ESM build

Make sure that your application code & *vuejs-datatable* share the same instance of Vue.

This library simply imports the module `vue`, so make sure that your application imports `vue` also.

```ts
// Wrong
const Vue = require( 'vue/dist/vue.esm.js' );
import Vue from 'vue/dist/vue.min.js';
// Right
const Vue = require( 'vue' );
import Vue from 'vue';
```

Instead of targeting the right build in your code, configure your bundler to alias the `vue` module as your desired `vue` dist file. Check below for [how to alias `vue`](#alias-the-codevuecode-module).

#### `You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.`

### Rollup

#### `'get' is not exported by node_modules/object-path/index.js` & `'set' is not exported by node_modules/object-path/index.js`

`object-path` being a *commonjs* module, you need to configure rollup to handle it properly. First, install the [plugin `rollup-plugin-commonjs`](https://www.npmjs.com/package/rollup-plugin-commonjs).

```bash
npm install --save-dev rollup-plugin-commonjs
```

Then, set up rollup:

```js
// ...
import commonjs from 'rollup-plugin-commonjs';

export default {
    // ...
    plugins:  [
        // ...
        commonjs( {
            namedExports: {
                'object-path': [ 'get', 'set' ],
            }
        } ),
        // ...
    ],
};
```

## Tips & tricks

### Alias the `vue` module

Because *vuejs-datatable* imports bare `vue`, you should configure your bundler to alias the distribution you want to use.

#### Rollup

Install the [plugin `rollup-plugin-alias`](https://www.npmjs.com/package/rollup-plugin-commonjs).

```bash
npm install --save-dev rollup-plugin-alias
```

Configure rollup to alias `vue` to the distribution you want.

```js
import alias from 'rollup-plugin-alias';

export default {
    // ...
    plugins:  [
        // ...
        alias( {
            entries: [
                { find:'vue', replacement: require.resolve( 'vue/dist/vue.esm.js' ) },
            ]
        } ),
        // ...
    ],
};
```
