
const globalConfig = window.globalConfig || {};
window.globalConfig = globalConfig;

/**
 * 获取全局配置
 */
export function getConfig(key){
  return key ? globalConfig[key] : globalConfig;
}

/**
 * 设置全局配置
 * @param key
 * @param value
 */
export function setConfig(key,value){
  globalConfig[key] = value;
}
