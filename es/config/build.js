
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./base');
const defineConfig = require('./defineConfig');
const {getCssRules,getFileRule,extraWebpackConfig} = require('./util');



module.exports = extraWebpackConfig({
  ...baseConfig,
  mode:'production',
  module:{
    rules:[
      ...baseConfig.module.rules,
      ...getCssRules({build:true}),
      getFileRule({build:true})
    ]
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