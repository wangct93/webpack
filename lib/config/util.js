const util = require('wangct-server-util');
const path = require('path');
const {resolve} = util;

module.exports = {
  getWebpackConfig,
  resolveLib,
  resolveSelf
};

function getWebpackConfig(config){
  const configPath = resolve('webpack.config.js');
  const isExist = util.isExist(configPath);
  return isExist ? require(configPath)(config) : config;
}

function resolveSelf(...paths){
  return path.resolve(__dirname,'../..',...paths);
}

function resolveLib(...paths){
  return resolveSelf('lib',...paths);
}
