
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./base');
const {getWebpackConfig} = require('./util');
const rules = require('./rules');


module.exports = getWebpackConfig({
  ...baseConfig,
  mode:'production',
  module:{
    rules:rules(true)
  },
  plugins:[
    ...baseConfig.plugins,
    new ExtractTextWebpackPlugin('[name].css'),
    new CleanWebpackPlugin({
      verbose:true
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ]
});