import {isStr, toPromise} from "@wangct/util";
import React from "react";
import {addFragment, removeFragment} from "./state";
import Loading from "../components/Loading";
import globalConfig from '../config/config';

/**
 * 获取全局配置
 */
export function getGlobalConfig(key){
  return key ? globalConfig[key] : globalConfig;
}

/**
 * 设置全局配置
 * @param key
 * @param value
 */
export function setGlobalConfig(key,value){
  globalConfig[key] = value;
}

/**
 * 显示加载中
 * @param promise
 * @param message
 * @returns {Q.Promise<T> | Promise<any> | Promise<T>}
 */
export function showLoading(promise,message = '操作处理中，请稍候...'){
  const content = <Loading loading title={message} />;
  addFragment(content);
  return toPromise(promise).finally(() => {
    removeFragment(content);
  });
}

/**
 * 获取元素
  * @param elem
 * @returns {HTMLElement}
 */
export function getElem(elem){
  return isStr(elem) ? document.getElementById(elem) : elem;
}


