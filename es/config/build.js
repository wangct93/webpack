
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const baseConfig = require('./base');
const defineConfig = require('./defineConfig');
const {getCssRules,resolveRoot} = require('./util');

module.exports = {
  ...baseConfig,
  mode:'production',
  output:{
    path:defineConfig.outputPath || resolveRoot('dist'),
    filename:'[name].js',
    publicPath: defineConfig.publicPath || '/'
  },
  module:{
    rules:[
      ...baseConfig.module.rules,
      ...getCssRules({build:true})
    ]
  },
  plugins:[
    ...baseConfig.plugins,
    new ExtractTextWebpackPlugin('index.css'),
    new CleanWebpackPlugin({
      verbose:true
    })
  ]
};