
const {getConfig,catchError} = require("./config");

const {resolve,isAry, isObj, toAry} = require('wangct-server-util');
const config = getConfig();

module.exports = {
  modelDir:'src/models',
  pageDir:'src/pages',
  componentDir:'src/components',
  configOutputDir:resolve('node_modules/wangct-react-entry/lib/config'),
  configPath:'config/config.js',
  entry:getEntry(),
  outputPath:resolve('dist'),
  outputPublicPath:'/',
  urlLoaderPublicPath:'/assets/',
  urlLoaderOutputPath:'assets',
  html:resolve(__dirname,'../html/index.html'),
  ...config,
};

function getEntry(){
  let {entry} = config;
  if(!isObj(entry) || isAry(entry)){
    entry = {
      index:toAry(entry),
    };
  }
  catchError(() => {
    require(resolve('node_modules/wangct-react-entry/package.json'));
    entry.index = toAry(entry.index).concat(resolve('node_modules/wangct-react-entry/lib/entry.js'));
  });
  return entry;
}
