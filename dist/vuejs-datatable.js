/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 79);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(15)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_path__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_object_path__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Column = function () {
    function Column(props) {
        _classCallCheck(this, Column);

        this.setAlignment(props.align);
        this.label = props.label || '';
        this.field = props.field || null;
        this.representedAs = props.representedAs || null;
        this.component = props.component || null;
        this.interpolate = props.interpolate || false;
        this.sortable = this.isSortable(props);
        this.filterable = this.isFilterable(props);
    }

    _createClass(Column, [{
        key: 'setAlignment',
        value: function setAlignment(value) {
            if (!value || typeof value !== 'string') {
                this.align = 'left';

                return this;
            }

            if (value.toLowerCase() === 'center') {
                this.align = 'center';

                return this;
            }

            if (value.toLowerCase() === 'right') {
                this.align = 'right';

                return this;
            }

            this.align = 'left';

            return this;
        }
    }, {
        key: 'isFilterable',
        value: function isFilterable(props) {
            if (props.filterable === false) {
                return false;
            }

            if (!props.field && !props.representedAs) {
                return false;
            }

            if (this.component && !(this.representedAs || this.field)) {
                return false;
            }

            return true;
        }
    }, {
        key: 'isSortable',
        value: function isSortable(props) {
            if (props.sortable === false) {
                return false;
            }

            if (!props.field && !props.representedAs) {
                return false;
            }

            if (this.component && !(this.representedAs || this.field)) {
                return false;
            }

            return true;
        }
    }, {
        key: 'getRepresentation',
        value: function getRepresentation(row) {
            if (this.representedAs && typeof this.representedAs === 'function') {
                return this.representedAs(row);
            }

            if (this.component && this.filterable) {
                return this.plain_text_function(row, this);
            }

            return __WEBPACK_IMPORTED_MODULE_0_object_path___default.a.get(row, this.field);
        }
    }, {
        key: 'getValue',
        value: function getValue(row) {
            return this.getRepresentation(row);
        }
    }, {
        key: 'matches',
        value: function matches(row, filter_string) {
            var col_representation = ('' + this.getRepresentation(row) + '').toLowerCase();

            return col_representation.indexOf(filter_string.toLowerCase()) !== -1;
        }
    }]);

    return Column;
}();

/* harmony default export */ __webpack_exports__["a"] = (Column);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_path__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_object_path__);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Settings = function () {
    function Settings() {
        _classCallCheck(this, Settings);

        this.properties = {
            table: {
                class: 'table table-hover table-striped',
                sorting: {
                    classes: {
                        canSort: ['sort'],
                        sortNone: ['glyphicon', 'glyphicon-sort'],
                        sortAsc: ['glyphicon', 'glyphicon-sort-by-alphabet'],
                        sortDesc: ['glyphicon', 'glyphicon-sort-by-alphabet-alt']
                    }
                }
            },
            pager: {
                classes: {
                    pager: 'pagination',
                    selected: 'active',
                    disabled: 'disabled'
                },
                icons: {
                    previous: '&lt;',
                    next: '&gt;'
                }
            }
        };
    }

    _createClass(Settings, [{
        key: 'get',
        value: function get(path) {
            return __WEBPACK_IMPORTED_MODULE_0_object_path___default.a.get(this.properties, path);
        }
    }, {
        key: 'set',
        value: function set(path, value) {
            __WEBPACK_IMPORTED_MODULE_0_object_path___default.a.set(this.properties, path, value);

            return this;
        }
    }, {
        key: 'merge',
        value: function merge(settings) {
            this.properties = this._mergeObjects(this.properties, settings);

            return this;
        }
    }, {
        key: '_mergeObjects',
        value: function _mergeObjects(obj_1, obj_2) {
            for (var key in obj_2) {

                if (_typeof(obj_2[key]) === 'object') {
                    obj_1[key] = this._mergeObjects(obj_1[key], obj_2[key]);

                    continue;
                }

                obj_1[key] = obj_2[key];
            }

            return obj_1;
        }
    }]);

    return Settings;
}();

/* harmony default export */ __webpack_exports__["a"] = (Settings);

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var toStr = Object.prototype.toString;
  function hasOwnProperty(obj, prop) {
    if(obj == null) {
      return false
    }
    //to handle objects with null prototypes (too edge case?)
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
  }

  function toString(type){
    return toStr.call(type);
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    return toStr.call(obj) === '[object Array]';
  }

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function factory(options) {
    options = options || {}

    var objectPath = function(obj) {
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        return proxy;
      }, {});
    };

    function hasShallowProperty(obj, prop) {
      return (options.includeInheritedProps || (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop))
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (typeof path === 'string') {
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if(typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
          obj = obj[j];
        } else {
          return false;
        }
      }

      return true;
    };

    objectPath.ensureExists = function (obj, path, value){
      return set(obj, path, value, true);
    };

    objectPath.set = function (obj, path, value, doNotReplace){
      return set(obj, path, value, doNotReplace);
    };

    objectPath.insert = function (obj, path, value, at){
      var arr = objectPath.get(obj, path);
      at = ~~at;
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }
      arr.splice(at, 0, value);
    };

    objectPath.empty = function(obj, path) {
      if (isEmpty(path)) {
        return void 0;
      }
      if (obj == null) {
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        return void 0;
      }

      if (typeof value === 'string') {
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
            delete value[i];
          }
        }
      } else {
        return objectPath.set(obj, path, null);
      }
    };

    objectPath.push = function (obj, path /*, values */){
      var arr = objectPath.get(obj, path);
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    objectPath.coalesce = function (obj, paths, defaultValue) {
      var value;

      for (var i = 0, len = paths.length; i < len; i++) {
        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
          return value;
        }
      }

      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (obj == null) {
        return defaultValue;
      }
      if (typeof path === 'string') {
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath)
      if (nextObj === void 0) {
        return defaultValue;
      }

      if (path.length === 1) {
        return nextObj;
      }

      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        return obj;
      }

      if (isEmpty(path)) {
        return obj;
      }
      if(typeof path === 'string') {
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      return obj;
    }

    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true})
  return mod;
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(14)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(9),
  /* template */
  __webpack_require__(13),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/charles/Packages/vue-datatable/src/vue-datatable.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-datatable.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5e69e222", Component.options)
  } else {
    hotAPI.reload("data-v-5e69e222", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_column_js__ = __webpack_require__(4);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
	props: {
		columns: [Object, Array],
		data: [Object, Array, String],
		filterBy: {
			type: String,
			default: null
		},
		perPage: {
			type: Number,
			default: null
		},
		page: {
			type: Number,
			default: 1
		}
	},
	data: function data() {
		return {
			sort_by: null,
			sort_dir: null,
			processed_rows: []
		};
	},
	computed: {
		rows: function rows() {
			return this.data.slice(0);
		},
		settings: function settings() {
			return this.$options.settings;
		},
		handler: function handler() {
			return this.$options.handler;
		},
		normalized_columns: function normalized_columns() {
			return this.columns.map(function (column) {
				return new __WEBPACK_IMPORTED_MODULE_0__classes_column_js__["a" /* default */](column);
			});
		},
		table_class: function table_class() {
			return this.settings.get('table.class');
		}
	},
	methods: {
		getSortDirectionForColumn: function getSortDirectionForColumn(column_definition) {
			if (this.sort_by !== column_definition) {
				return null;
			}

			return this.sort_dir;
		},
		setSortDirectionForColumn: function setSortDirectionForColumn(direction, column) {
			this.sort_by = column;
			this.sort_dir = direction;
		},
		processRows: function processRows() {
			var filtered_data = this.handler.filterHandler(this.rows, this.filterBy, this.normalized_columns);

			this.$emit('filtered', filtered_data);

			var sorted_rows = this.handler.sortHandler(filtered_data, this.sort_by, this.sort_dir);

			var paged_data = this.handler.paginateHandler(sorted_rows, this.perPage, this.page);

			this.handler.displayHandler(paged_data, this.setRows);
		},
		setRows: function setRows(rows) {
			this.processed_rows = rows;
		}
	},
	created: function created() {
		this.$watch(function () {
			console.log(this.data);
			return this.data;
		}.bind(this), this.processRows, { deep: true });

		this.$watch('columns', this.processRows);

		this.$watch(function () {
			return this.filterBy + this.perPage + this.page + this.sort_by + this.sort_dir;
		}.bind(this), this.processRows);

		this.processRows();
	},

	handler: null,
	settings: null
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
exports.push([module.i, "", ""]);

/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(37)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(25),
  /* template */
  __webpack_require__(33),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/charles/Packages/vue-datatable/src/vue-datatable-pager-button.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-datatable-pager-button.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-670a2812", Component.options)
  } else {
    hotAPI.reload("data-v-670a2812", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('table', {
    class: _vm.table_class
  }, [_c('thead', [_c('tr', _vm._l((_vm.normalized_columns), function(head_column) {
    return _c('datatable-header', {
      attrs: {
        "column": head_column,
        "settings": _vm.settings,
        "direction": _vm.getSortDirectionForColumn(head_column)
      },
      on: {
        "change": _vm.setSortDirectionForColumn
      }
    })
  }))]), _vm._v(" "), _c('tbody', [_vm._l((_vm.processed_rows), function(row) {
    return _vm._t("rows", [_c('tr', _vm._l((_vm.normalized_columns), function(column) {
      return _c('datatable-cell', {
        attrs: {
          "column": column,
          "row": row,
          "settings": _vm.settings
        }
      })
    }))], {
      row: row
    })
  })], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5e69e222", module.exports)
  }
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("15a2f00e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5e69e222!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5e69e222!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_datatable_cell_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_datatable_cell_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_datatable_cell_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_datatable_header_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_datatable_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__vue_datatable_header_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vue_datatable_pager_button_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vue_datatable_pager_button_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__vue_datatable_pager_button_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__table_type_js__ = __webpack_require__(18);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






var DatatableFactory = function () {
    function DatatableFactory() {
        _classCallCheck(this, DatatableFactory);

        this.table_types = [];
        this.use_default_type = true;
    }

    _createClass(DatatableFactory, [{
        key: 'useDefaultType',
        value: function useDefaultType(value) {
            this.use_default_type = !!value;

            return this;
        }
    }, {
        key: 'registerTableType',
        value: function registerTableType(component_name, callback) {
            var table_type = new __WEBPACK_IMPORTED_MODULE_3__table_type_js__["a" /* default */](component_name);

            this.table_types.push(table_type);

            if (callback && typeof callback === 'function') {
                callback(table_type);
            }

            return this;
        }
    }, {
        key: 'install',
        value: function install(Vue) {
            Vue.component('datatable-cell', __WEBPACK_IMPORTED_MODULE_0__vue_datatable_cell_vue___default.a);
            Vue.component('datatable-header', __WEBPACK_IMPORTED_MODULE_1__vue_datatable_header_vue___default.a);
            Vue.component('datatable-button', __WEBPACK_IMPORTED_MODULE_2__vue_datatable_pager_button_vue___default.a);

            if (this.use_default_type) {
                this.registerTableType('datatable');
            }

            for (var i in this.table_types) {
                this.installTableType(this.table_types[i].getId(), this.table_types[i], Vue);
            }
        }
    }, {
        key: 'installTableType',
        value: function installTableType(id, table_type, Vue) {
            Vue.component(id, table_type.getTableDefinition());
            Vue.component(id + '-pager', table_type.getPagerDefinition());
        }
    }]);

    return DatatableFactory;
}();

/* harmony default export */ __webpack_exports__["a"] = (DatatableFactory);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Handler = function () {
    function Handler() {
        _classCallCheck(this, Handler);

        this.filterHandler = this.handleFilter;
        this.sortHandler = this.handleSort;
        this.paginateHandler = this.handlePaginate;
        this.displayHandler = this.handleDisplay;
    }

    _createClass(Handler, [{
        key: 'handleFilter',
        value: function handleFilter(data, filter, columns) {
            if (!filter) {
                return data;
            }

            var filter_strings = filter.split(/\s/);

            return data.filter(function (row) {
                for (var i in filter_strings) {
                    if (!this.rowMatches(row, filter_strings[i], columns)) {
                        return false;
                    }
                }

                return true;
            }.bind(this));
        }
    }, {
        key: 'rowMatches',
        value: function rowMatches(row, filter_string, columns) {
            for (var i in columns) {
                if (columns[i].matches(row, filter_string)) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'handleSort',
        value: function handleSort(filtered_data, sort_column, sort_dir) {
            if (!sort_column || sort_dir === null) {
                return filtered_data;
            }

            return filtered_data.sort(function (a, b) {
                var value_a = sort_column.getRepresentation(a);
                var value_b = sort_column.getRepresentation(b);

                if (value_a == value_b) {
                    return 0;
                }

                var sort_val = value_a > value_b ? 1 : -1;

                if (sort_dir === 'desc') {
                    sort_val *= -1;
                }

                return sort_val;
            });
        }
    }, {
        key: 'handlePaginate',
        value: function handlePaginate(sorted_data, page_count, page_number) {
            if (!page_count) {
                return sorted_data;
            }

            if (page_number < 1) {
                page_number = 1;
            }

            var start_index = (page_number - 1) * page_count;
            var end_index = page_number * page_count;

            return sorted_data.slice(start_index, end_index);
        }
    }, {
        key: 'handleDisplay',
        value: function handleDisplay(paged_data, setRows) {
            return setRows(paged_data);
        }
    }]);

    return Handler;
}();

/* harmony default export */ __webpack_exports__["a"] = (Handler);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_datatable_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_datatable_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_datatable_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_datatable_pager_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_datatable_pager_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__vue_datatable_pager_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__handler_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__settings_js__ = __webpack_require__(5);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






var TableType = function () {
    function TableType(id) {
        _classCallCheck(this, TableType);

        this.id = id;

        this.handler = new __WEBPACK_IMPORTED_MODULE_2__handler_js__["a" /* default */]();
        this.settings = new __WEBPACK_IMPORTED_MODULE_3__settings_js__["a" /* default */]();
    }

    _createClass(TableType, [{
        key: 'getId',
        value: function getId() {
            return this.id;
        }
    }, {
        key: 'setFilterHandler',
        value: function setFilterHandler(closure) {
            this.handler.filterHandler = closure;

            return this;
        }
    }, {
        key: 'setSortHandler',
        value: function setSortHandler(closure) {
            this.handler.sortHandler = closure;

            return this;
        }
    }, {
        key: 'setPaginateHandler',
        value: function setPaginateHandler(closure) {
            this.handler.paginateHandler = closure;

            return this;
        }
    }, {
        key: 'setDisplayHandler',
        value: function setDisplayHandler(closure) {
            this.handler.displayHandler = closure;

            return this;
        }
    }, {
        key: 'setting',
        value: function setting(path, value) {
            if (value === undefined) {
                return this.settings.get(path);
            }

            this.settings.set(path, value);

            return this;
        }
    }, {
        key: 'mergeSettings',
        value: function mergeSettings(settings) {
            this.settings.merge(settings);

            return this;
        }
    }, {
        key: 'getTableDefinition',
        value: function getTableDefinition() {
            var definition = this.clone(__WEBPACK_IMPORTED_MODULE_0__vue_datatable_vue___default.a);
            definition.handler = this.handler;
            definition.settings = this.settings;
            definition.name = this.id;

            return definition;
        }
    }, {
        key: 'getPagerDefinition',
        value: function getPagerDefinition() {
            var definition = this.clone(__WEBPACK_IMPORTED_MODULE_1__vue_datatable_pager_vue___default.a);
            definition.settings = this.settings;
            definition.name = this.id;

            return definition;
        }
    }, {
        key: 'clone',
        value: function clone(obj) {
            var copy;

            if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== "object") {
                return obj;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];

                for (var i = 0; i < obj.length; i++) {
                    copy[i] = this.clone(obj[i]);
                }

                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};

                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = this.clone(obj[attr]);
                    }
                }

                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");
        }
    }]);

    return TableType;
}();

/* harmony default export */ __webpack_exports__["a"] = (TableType);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(38)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(23),
  /* template */
  __webpack_require__(34),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/charles/Packages/vue-datatable/src/vue-datatable-cell.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-datatable-cell.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d3d79646", Component.options)
  } else {
    hotAPI.reload("data-v-d3d79646", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(36)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(24),
  /* template */
  __webpack_require__(32),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/charles/Packages/vue-datatable/src/vue-datatable-header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-datatable-header.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-66ed13c8", Component.options)
  } else {
    hotAPI.reload("data-v-66ed13c8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(35)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(26),
  /* template */
  __webpack_require__(31),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/charles/Packages/vue-datatable/src/vue-datatable-pager.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-datatable-pager.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0393cb58", Component.options)
  } else {
    hotAPI.reload("data-v-0393cb58", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	props: {
		column: [Object, Array],
		row: [Object, Array]
	},
	computed: {
		content: function content() {
			return this.column.getRepresentation(this.row);
		}
	}
});

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	props: {
		model: {
			prop: 'direction',
			event: 'change'
		},
		column: [Object, Array],
		settings: Object,
		direction: {
			type: String,
			default: null
		}
	},
	computed: {
		canSort: function canSort() {
			return this.column.sortable;
		},
		is_sorted_ascending: function is_sorted_ascending() {
			return this.direction === 'asc';
		},
		is_sorted_descending: function is_sorted_descending() {
			return this.direction === 'desc';
		},
		is_sorted: function is_sorted() {
			return this.is_sorted_descending || this.is_sorted_ascending;
		},
		classes: function classes() {
			var available_classes = this.settings.get('table.sorting.classes');
			var classes = available_classes.canSort;

			if (!this.canSort) {
				return '';
			}

			if (!this.is_sorted) {
				classes = classes.concat(available_classes.sortNone);

				return this.joinClasses(classes);
			}

			if (this.is_sorted_ascending) {
				classes = classes.concat(available_classes.sortAsc);
			}

			if (this.is_sorted_descending) {
				classes = classes.concat(available_classes.sortDesc);
			}

			return this.joinClasses(classes);
		}
	},
	methods: {
		joinClasses: function joinClasses(classes) {
			return this.unique(classes).join(' ');
		},
		toggleSort: function toggleSort() {
			if (!this.direction || this.direction === null) {
				this.$emit('change', 'asc', this.column);
			} else if (this.direction === 'asc') {
				this.$emit('change', 'desc', this.column);
			} else {
				this.$emit('change', null, this.column);
			}

			return;
		},
		unique: function unique(ar) {
			var seen = {};

			return ar.filter(function (item) {
				return seen.hasOwnProperty(item) ? false : seen[item] = true;
			});
		}
	}
});

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_settings_js__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		},
		value: {
			type: Number,
			default: null
		}
	},
	computed: {
		li_classes: function li_classes() {
			var classes = [];

			if (this.disabled) {
				classes.push(this.settings.get('pager.classes.disabled'));
			}

			if (this.selected) {
				classes.push(this.settings.get('pager.classes.selected'));
			}

			return classes.join(' ');
		},
		settings: function settings() {
			return this.$parent.settings;
		}
	},
	methods: {
		sendClick: function sendClick() {
			if (!this.disabled) {
				this.$emit('click', this.value);
			}
		}
	}
});

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: Number,
			default: 1
		},
		perPage: {
			type: Number,
			default: null
		},
		totalRows: {
			type: Number,
			default: 0
		},
		type: {
			type: String,
			default: 'long'
		}
	},
	computed: {
		show: function show() {
			return this.totalRows > 0;
		},
		pagination_class: function pagination_class() {
			return this.settings.get('pager.classes.pager');
		},
		disabled_class: function disabled_class() {
			return this.settings.get('pager.classes.disabled');
		},
		previous_link_classes: function previous_link_classes() {
			if (this.value - 1 < 1) {
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		next_link_classes: function next_link_classes() {
			if (this.value + 1 > this.total_pages) {
				return this.settings.get('pager.classes.disabled');
			}

			return '';
		},
		total_pages: function total_pages() {
			if (!(this.totalRows > 0)) {
				return 0;
			}

			return Math.ceil(this.totalRows / this.perPage);
		},
		previous_icon: function previous_icon() {
			return this.settings.get('pager.icons.previous');
		},
		next_icon: function next_icon() {
			return this.settings.get('pager.icons.next');
		},
		settings: function settings() {
			return this.$options.settings;
		}
	},
	methods: {
		setPageNum: function setPageNum(number) {
			this.$emit('change', number);
		},
		getClassForPage: function getClassForPage(number) {
			if (this.value == number) {
				return this.settings.get('pager.classes.selected');
			}

			return '';
		}
	},
	watch: {
		totalRows: function totalRows() {
			if (this.value > this.total_pages) {
				this.setPageNum(this.total_pages);
			}
		}
	},
	settings: null
});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
exports.push([module.i, "", ""]);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
exports.push([module.i, "", ""]);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
exports.push([module.i, "", ""]);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
exports.push([module.i, "", ""]);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.show) ? _c('nav', [(_vm.type === 'abbreviated') ? _c('ul', {
    class: _vm.pagination_class
  }, [(_vm.value - 3 >= 1) ? _c('datatable-button', {
    attrs: {
      "value": 1
    },
    on: {
      "click": _vm.setPageNum
    }
  }) : _vm._e(), _vm._v(" "), (_vm.value - 4 >= 1) ? _c('datatable-button', {
    attrs: {
      "disabled": ""
    }
  }, [_vm._v("...")]) : _vm._e(), _vm._v(" "), (_vm.value - 2 >= 1) ? _c('datatable-button', {
    attrs: {
      "value": _vm.value - 2
    },
    on: {
      "click": _vm.setPageNum
    }
  }) : _vm._e(), _vm._v(" "), (_vm.value - 1 >= 1) ? _c('datatable-button', {
    attrs: {
      "value": _vm.value - 1
    },
    on: {
      "click": _vm.setPageNum
    }
  }) : _vm._e(), _vm._v(" "), _c('datatable-button', {
    attrs: {
      "value": _vm.value,
      "selected": ""
    }
  }), _vm._v(" "), (_vm.value + 1 <= _vm.total_pages) ? _c('datatable-button', {
    attrs: {
      "value": _vm.value + 1
    },
    on: {
      "click": _vm.setPageNum
    }
  }) : _vm._e(), _vm._v(" "), (_vm.value + 2 <= _vm.total_pages) ? _c('datatable-button', {
    attrs: {
      "value": _vm.value + 2
    },
    on: {
      "click": _vm.setPageNum
    }
  }) : _vm._e(), _vm._v(" "), (_vm.value + 4 <= _vm.total_pages) ? _c('datatable-button', {
    attrs: {
      "disabled": ""
    }
  }, [_vm._v("...")]) : _vm._e(), _vm._v(" "), (_vm.value + 3 <= _vm.total_pages) ? _c('datatable-button', {
    attrs: {
      "value": _vm.total_pages
    },
    on: {
      "click": _vm.setPageNum
    }
  }) : _vm._e()], 1) : (_vm.type === 'long') ? _c('ul', {
    class: _vm.pagination_class
  }, _vm._l((_vm.total_pages), function(i) {
    return _c('datatable-button', {
      attrs: {
        "value": i,
        "selected": i === _vm.value
      },
      on: {
        "click": _vm.setPageNum
      }
    })
  })) : (_vm.type === 'short') ? _c('ul', {
    class: _vm.pagination_class
  }, [_c('datatable-button', {
    attrs: {
      "disabled": _vm.value - 1 < 1,
      "value": _vm.value - 1
    },
    on: {
      "click": _vm.setPageNum
    }
  }, [_c('span', {
    domProps: {
      "innerHTML": _vm._s(_vm.previous_icon)
    }
  })]), _vm._v(" "), _c('datatable-button', {
    attrs: {
      "value": _vm.value
    }
  }), _vm._v(" "), _c('datatable-button', {
    attrs: {
      "disabled": _vm.value + 1 > _vm.total_pages,
      "value": _vm.value + 1
    },
    on: {
      "click": _vm.setPageNum
    }
  }, [_c('span', {
    domProps: {
      "innerHTML": _vm._s(_vm.next_icon)
    }
  })])], 1) : _vm._e()]) : _vm._e()
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0393cb58", module.exports)
  }
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('th', {
    style: ({
      'text-align': _vm.column.align
    })
  }, [_vm._v("\n\t" + _vm._s(_vm.column.label) + "\n\t"), (_vm.column.sortable) ? _c('span', {
    class: _vm.classes,
    on: {
      "click": _vm.toggleSort
    }
  }) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-66ed13c8", module.exports)
  }
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    class: _vm.li_classes
  }, [_c('a', {
    attrs: {
      "href": "javascript: void(0);"
    },
    on: {
      "click": _vm.sendClick
    }
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.value))])], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-670a2812", module.exports)
  }
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('td', {
    style: ({
      'text-align': _vm.column.align
    })
  }, [(_vm.column.component) ? _c(_vm.column.component, {
    tag: "component",
    attrs: {
      "row": _vm.row,
      "column": _vm.column
    }
  }) : (_vm.column.interpolate) ? _c('span', {
    domProps: {
      "innerHTML": _vm._s(_vm.content)
    }
  }) : _c('span', [_vm._v(_vm._s(_vm.content))])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d3d79646", module.exports)
  }
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("631c48bc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-0393cb58!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-pager.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-0393cb58!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-pager.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("f48ebcea", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-66ed13c8!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-header.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-66ed13c8!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-header.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("7e0289f9", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-670a2812!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-pager-button.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-670a2812!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-pager-button.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("143d692b", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-d3d79646!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-cell.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-d3d79646!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-datatable-cell.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(67);


window.Vue.use(__WEBPACK_IMPORTED_MODULE_0__index__["a" /* default */]);

/***/ }),
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_classes_factory_js__ = __webpack_require__(16);


/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0__src_classes_factory_js__["a" /* default */]());

/***/ }),
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(46);


/***/ })
/******/ ]);