
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config');
const util = require('wangct-server-util');
const {resolveLib} = require('./util');
const {resolve,arrayUtil} = util;
const {extraWebpackConfig,componentConfigPath} = config;

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
      '@lib':resolve(componentConfigPath,'..'),
      ...config.extraAlias
    },
    ...extraWebpackConfig.resolve
  },
  plugins:[
    new HtmlWebpackPlugin(config.html || {
      template:resolve(entryDir,'public/index.html')
    })
  ]
};

function getEntry(){
  const paths = arrayUtil.toArray(extraWebpackConfig.entry).filter(item => item);
  paths.unshift(entryDir);
  return {
    index:paths
  }
}