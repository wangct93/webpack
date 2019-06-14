
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {extraWebpackConfig} = require('./util');
const config = require('./config');
const util = require('wangct-server-util');
const {resolve,arrayUtil} = util;



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
      '@lib':resolve('src/components'),
      ...config.extraAlias
    },
    ...extraWebpackConfig.resolve
  },
  devtool:config.devtool || 'cheap-module-eval-source-map',
  plugins:[
    new HtmlWebpackPlugin(config.html || {
      template:resolve('src/_entry/public/index.html')
    })
  ]
};

function getEntry(){
  const paths = arrayUtil.toArray(extraWebpackConfig.entry).filter(item => item);
  paths.unshift(resolve('src/_entry/index'));
  return {
    index:paths
  }
}