const util = require('wangct-server-util');
const config = require('./config');
const {resolve} = util;

module.exports = {
  getWebpackConfig,
  extraWebpackConfig:config.webpack || {}
};

function getWebpackConfig(config){
  const configPath = resolve('webpack.config.js');
  const isExist = util.isExist(configPath);
  return isExist ? require(configPath)(config) : config;
}
