"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require('path');

var resolve = function resolve() {
  for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return path.resolve.apply(path, [process.cwd()].concat(paths));
};

var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

var CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin');

var baseConfig = require('./base');

var defineConfig = require('./defineConfig');

var _require = require('./util'),
    getCssRules = _require.getCssRules;

module.exports = _objectSpread({}, baseConfig, {
  mode: 'production',
  output: {
    path: defineConfig.outputPath || resolve('dist'),
    filename: '[name].js',
    publicPath: defineConfig.publicPath || '/'
  },
  module: {
    rules: [].concat(_toConsumableArray(baseConfig.module.rules), _toConsumableArray(getCssRules({
      build: true
    })))
  },
  plugins: [].concat(_toConsumableArray(baseConfig.plugins), [new ExtractTextWebpackPlugin('index.css'), new CleanWebpackPlugin({
    verbose: true
  })])
});

function getLessRules(rules) {
  return rules.map(function (item) {
    var _item$use = item.use,
        use = _item$use === void 0 ? [] : _item$use;
    return _objectSpread({}, item, {
      test: /\.(less|css)$/,
      use: ExtractTextWebpackPlugin.extract({
        fallback: 'style-loader',
        use: use.slice(1)
      })
    });
  });
}