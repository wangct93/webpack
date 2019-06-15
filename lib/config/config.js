const util = require('wangct-server-util');

const config = {
  modelDir:'src/models',
  pageDir:'src/pages',
  componentConfigPath:'src/components/config.js',
  configOutputDir:'src/_entry/config',
  configPath:'config/config.js'
};

let extraConfig = {};
try{
  extraConfig = require(util.resolve('config/config'));
}catch(e){}

module.exports = {
  ...config,
  ...extraConfig
};