
const util = require('wangct-server-util');
const {resolveLib} = require('./util');

const config = {
  modelDir:'src/models',
  pageDir:'src/pages',
  componentConfigPath:'src/components/config.js',
  configOutputDir:resolveLib('..','entry/config'),
  configPath:'config/config.js',
  output:{}
};

let extraConfig = {};
try{
  extraConfig = require(util.resolve('config/config'));
}catch(e){}

module.exports = {
  ...config,
  ...extraConfig,
  extraWebpackConfig:extraConfig.webpack || {}
};