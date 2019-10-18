
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const config = require('./config');
const util = require('wangct-server-util');
const {resolveLib} = require('./util');
const {resolve,toArray} = util;
const {extraWebpackConfig,componentDir} = config;

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
      template:resolveLib('public/index.html')
    }),
    new ProgressBarWebpackPlugin()
  ]
};

function getEntry(){
  let {entry} = extraWebpackConfig;
  if(!util.isObject(entry)){
    entry = {
      index:toArray(entry)
    }
  }
  entry.index = toArray(entry.index).concat('wangct-react-entry/lib/entry.js');
  return entry;
}
