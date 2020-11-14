import {aryRemove, isDef, isObj, isStr, stringify, toPromise} from "@wangct/util";
import React from "react";
import Loading from 'wangct-react/lib/Loading';
import {getFrameState, getStore} from "./state";
import {getStoreDispatch} from "../modules/store";
import {Fields} from "../json/dic";

/**
 * dispatch
 * @param args
 */
export function dispatch(...args){
  return getDispatch()(...args);
}

/**
 * 获取dispatch方法
 * @param namespace
 * @returns {function(...[*]=)}
 */
export function getDispatch(namespace){
  return getStoreDispatch(getStore(),namespace);
}

let globalConfig = {};

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
  if(isDef(value)){
    globalConfig[key] = value;
  }else{
    globalConfig = key;
  }
}


/**
 * 更新路由
 * @param routes
 */
export function setRoutes(routes){
  dispatch({
    type:Fields.globalNamespace + '/updateField',
    field:'routes',
    data:routes,
  });
}

/**
 * 获取路由
 * @returns {*|{}|[{path: string, component: string}]|[{path: string, component: string}]|Route[]|Requireable<any[]>}
 */
export function getRoutes(){
  return getFrameState().routes || []
}

/**
 * 显示加载中
 * @param promise
 * @param message
 * @returns {Q.Promise<T> | Promise<any> | Promise<T>}
 */
export function showLoading(promise,message = '操作处理中，请稍候...'){
  const {fragmentList = []} = getFrameState();
  const content = <Loading loading title={message} />;
  dispatch({
    type:'updateField',
    field:'fragmentList',
    data:[...fragmentList,content],
  });
  return toPromise(promise).finally(() => {
    const {fragmentList = []} = getFrameState();
    aryRemove(fragmentList,content);
    dispatch({
      type:'updateField',
      field:'fragmentList',
      data:[...fragmentList],
    });
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

/**
 * 获取redux数据
  * @param namespace
 * @returns {*|{}}
 */
export function getState(namespace = 'global'){
  return getStore()[namespace] || {};
}

/**
 * 更新model
 * @param namespace
 * @param type
 * @param data
 */
export function updateModel(namespace = 'global',type,data){
  if(isObj(type)){
    getDispatch(namespace)({
      type:'update',
      field:'multiple',
      data:type,
    });
  }else{
    getDispatch(namespace)({
      ...data,
      type,
    });
  }
}
