
const {resolve,isAry, isObj, toAry} = require('node-util-1');
const config = require('./config');
module.exports = {
  modelDir:'src/models',
  pageDir:'src/pages',
  componentDir:'src/components',
  configPath:'config/config.js',
  configOutput:resolve('src/frame/config'),
  entryPath:resolve('src'),
  outputPath:resolve('dist'),
  outputPublicPath:'/',
  urlLoaderPublicPath:'/assets/',
  urlLoaderOutputPath:'assets',
  ...config,
};
