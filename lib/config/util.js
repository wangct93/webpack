"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var util = require('wangct-server-util');

var path = require('path');

var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

var objectUtil = util.objectUtil;

var defineConfig = require('./defineConfig');

var resolve = function resolve() {
  for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return path.resolve.apply(path, [__dirname, '../..'].concat(paths));
};

var resolveRoot = function resolveRoot() {
  for (var _len2 = arguments.length, paths = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    paths[_key2] = arguments[_key2];
  }

  return path.resolve.apply(path, [process.cwd()].concat(paths));
};

module.exports = {
  getCssRules: getCssRules,
  resolve: resolve,
  resolveRoot: resolveRoot
};

function getCssRules(opt) {
  var disableCssModules = defineConfig.disableCssModules;

  if (disableCssModules === true) {
    return [getCssRule(_objectSpread({}, opt, {
      disableCssModules: true
    }))];
  } else {
    var noCssModulePaths = [resolveRoot('node_modules/antd')];

    if (util.isArray(disableCssModules)) {
      noCssModulePaths = noCssModulePaths.concat(disableCssModules);
    }

    return [getCssRule(_objectSpread({}, opt, {
      exclude: noCssModulePaths
    })), getCssRule(_objectSpread({}, opt, {
      disableCssModules: true,
      include: noCssModulePaths
    }))];
  }
}

function getCssRule(opt) {
  var build = opt.build,
      disableCssModules = opt.disableCssModules;
  var cssLoader = disableCssModules ? 'css-loader' : {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: true,
      localIdentName: '[name]__[local]___[hash:base64:5]'
    }
  };
  var lessLoader = {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true
    }
  };
  var use = [cssLoader, lessLoader];
  return _objectSpread({
    test: /\.(css|less|scss)$/,
    use: build ? ExtractTextWebpackPlugin.extract({
      fallback: 'style-loader',
      use: use
    }) : ['style-loader'].concat(use)
  }, objectUtil.clone(opt, ['include', 'exclude']));
}