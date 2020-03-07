const {isFunc} = require("wangct-util/lib/typeUtil");
const {resolve} = require('wangct-server-util');

const {EnumEnv} = require('./options');

exports.isDevEnv = () => {
  return process.env.env === EnumEnv.dev;
};

/**
 * 获取数组byMap
 * @param mapData
 * @param config
 * @returns {[]}
 */
exports.getListByMap = (mapData,config) => {
  const plugins = [];
  Object.keys(mapData).forEach((key) => {
    if(!config[key]){
      return;
    }
    let value = mapData[key];
    value = isFunc(value) ? value(config[key]) : value;
    if(value){
      plugins.push(value);
    }
  });
  return plugins;
};

exports.webpackConfigFormat = (config) => {
  config = catchError(() => {
    const func = require(resolve('webpack.config.js'));
    return func(config);
  },config,false);
  return config;
};

exports.catchError = catchError;

function catchError(func,value,needLog = true){
  try{
    value = func();
  }catch(e){
    if(needLog){
      console.log('该异常不影响后续代码执行',e);
    }
  }
  return value;
}
