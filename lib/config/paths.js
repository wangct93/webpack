
const {resolve,isAry, isObj, toAry} = require('wangct-server-util');
const config = require('./config');
module.exports = {
  modelDir:'src/models',
  pageDir:'src/pages',
  componentDir:'src/components',
  configPath:'config/config.js',
  configOutput:resolve('node_modules/wangct-react-entry/lib/config'),
  entryPath:resolve('src'),
  outputPath:resolve('dist'),
  outputPublicPath:'/',
  urlLoaderPublicPath:'/assets/',
  urlLoaderOutputPath:'assets',
  ...config,
};
