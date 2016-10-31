var elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir(function(mix) {
    mix.webpack('./src/es5.js', './dist/vuejs-datatable.js');
});
