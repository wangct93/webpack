
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const config = require('./config');
const util = require('wangct-server-util');
const {resolveLib} = require('./util');
const {resolve,toArray} = util;
const {extraWebpackConfig,componentDir} = config;

const entryDir = resolveLib('../entry');

module.exports = {
  entry:getEntry(),
  output:{
    path:resolve('dist'),
    filename:'[name].js',
    publicPath:'/',
    ...extraWebpackConfig.output
  },
  externals:extraWebpackConfig.externals,
  resolve:{
    extensions:['.js','jsx','.ts','.tsx'],
    alias:{
      '@':resolve('src'),
      '@lib':resolve(componentDir),
      ...config.extraAlias
    },
    ...extraWebpackConfig.resolve
  },
  plugins:[
    new HtmlWebpackPlugin(config.html || {
      template:resolve(entryDir,'public/index.html')
    }),
    new ProgressBarWebpackPlugin()
  ]
};

function getEntry(){
  const paths = toArray(extraWebpackConfig.entry).filter(item => item);
  paths.unshift(entryDir);
  return {
    index:paths
  }
}
