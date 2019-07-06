const util = require('wangct-server-util');
const path = require('path');
const resolveLib = (...paths) => path.resolve(__dirname,'..',...paths);
const {resolve} = util;

module.exports = {
  getWebpackConfig,
  resolveLib
};

function getWebpackConfig(config){
  const configPath = resolve('webpack.config.js');
  const isExist = util.isExist(configPath);
  return isExist ? require(configPath)(config) : config;
}
