"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var path = require('path');

var resolve = function resolve() {
  for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return path.resolve.apply(path, [process.cwd()].concat(paths));
};

var baseConfig = require('./base');

var webpack = require('webpack');

var defineConfig = require('./defineConfig');

module.exports = {
  mode: 'development',
  entry: baseConfig.entry,
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [].concat(_toConsumableArray(baseConfig.module.rules), _toConsumableArray(baseConfig.lessRules))
  },
  plugins: [].concat(_toConsumableArray(baseConfig.plugins), [new webpack.HotModuleReplacementPlugin()], _toConsumableArray(defineConfig.plugins || [])),
  devServer: _objectSpread({
    contentBase: resolve('public'),
    port: 8888,
    hot: true,
    historyApiFallback: true,
    proxy: defineConfig.proxy
  }, defineConfig.devServer)
};