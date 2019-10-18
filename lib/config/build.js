
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./base');
const config = require('./config');
const {getWebpackConfig} = require('./util');
const {getRules} = require('./rules');

console.log('222')
module.exports = getWebpackConfig({
  ...baseConfig,
  output:{
    ...baseConfig.output,
    ...config.output.build
  },
  mode:'production',
  devtool:'none',
  module:{
    rules:getRules(true)
  },
  plugins:[
    ...baseConfig.plugins,
    new ExtractTextWebpackPlugin({
      filename:'[name].css',
      allChunks:true,
      ignoreOrder:true
    }),
    new CleanWebpackPlugin({
      verbose:true
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ]
});
