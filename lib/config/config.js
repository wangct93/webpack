
const {resolve} = require('wangct-server-util');

const config = {
  modelDir:'src/models',
  pageDir:'src/pages',
  componentDir:'src/components',
  configOutputDir:resolve('node_modules/wangct-react-entry/lib/config'),
  configPath:'config/config.js',
  output:{}
};

let extraConfig = {};
try{
  extraConfig = require(resolve('config/config'));
}catch(e){
  console.error(e);
}

module.exports = {
  ...config,
  ...extraConfig,
  extraWebpackConfig:extraConfig.webpack || {}
};
