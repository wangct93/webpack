"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');

var resolve = function resolve() {
  for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return path.resolve.apply(path, [process.cwd()].concat(paths));
};

var resolveDva = function resolveDva() {
  for (var _len2 = arguments.length, paths = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    paths[_key2] = arguments[_key2];
  }

  return path.resolve.apply(path, [__dirname, '../..'].concat(paths));
};

var defineConfig = require('./defineConfig');

var indexPath = resolveDva(defineConfig.isSelf ? 'es' : 'lib', 'src/index');
module.exports = {
  entry: {
    index: [indexPath].concat(defineConfig.entry).filter(function (item) {
      return !!item;
    })
  },
  externals: defineConfig.externals,
  resolve: {
    alias: defineConfig.alias,
    extensions: defineConfig.extraResolveExtensions
  },
  devtool: defineConfig.devtool,
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env'].concat(_toConsumableArray(defineConfig.extraBabelPresets || [])),
          plugins: ['@babel/plugin-transform-runtime', ['import', {
            libraryName: 'antd',
            style: true
          }, 'ant'], ['import', {
            libraryName: 'wangct-react',
            customName: function customName(name) {
              return "wangct-react/lib/".concat(name);
            }
          }, 'wct'], ['@babel/plugin-proposal-decorators', {
            legacy: true
          }], '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-export-default-from'].concat(_toConsumableArray(defineConfig.extraBabelPlugins || []))
        }
      }],
      exclude: resolve('node_modules')
    }, {
      test: /\.(ts|js)x?$/,
      enforce: 'pre',
      use: 'eslint-loader',
      exclude: resolve('node_modules')
    }, {
      test: /\.(gif|jpg|jpeg|png|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'static/[name]_[hash].[ext]'
        }
      }]
    }].concat(_toConsumableArray(defineConfig.rules || []))
  },
  plugins: [new HtmlWebpackPlugin(defineConfig.html || {
    template: resolve(__dirname, '../public/index.html')
  })]
};