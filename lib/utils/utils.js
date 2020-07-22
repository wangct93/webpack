const {isFunc} = require("util-1/lib/typeUtil");
const {resolve} = require('node-util-1');

const {EnumEnv} = require('./options');

exports.isDevEnv = isDevEnv;
exports.getListByMap = getListByMap;
exports.webpackConfigFormat = webpackConfigFormat;
exports.catchError = catchError;
exports.resolveLib = resolveLib;

/**
 * lib地址
 * @param paths
 * @returns {*}
 */
function resolveLib(...paths){
  return resolve(__dirname,'..',...paths);
}

/**
 * 判断是否为开发环境
 * @returns {boolean}
 */
function isDevEnv(){
  return process.env.env === EnumEnv.dev;
}

/**
 * 获取数组byMap
 * @param mapData
 * @param config
 * @returns {[]}
 */

function getListByMap(mapData,config){
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
}

/**
 * webpack配置格式化
 * @param config
 * @returns {*}
 */
function webpackConfigFormat(config){
  config = catchError(() => {
    const func = require(resolve('webpack.config.js'));
    return func(config);
  },config,false);
  return config;
}

/**
 * 捕捉错误
 * @param func
 * @param value
 * @param needLog
 * @returns {*}
 */
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

async function copyFrameFile(){

}
