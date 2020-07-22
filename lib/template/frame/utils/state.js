import {connect} from "react-redux";
import {getGlobalConfig, setGlobalConfig} from "./utils";
import {Fields} from "../json/dic";


/**
 * 获取框架state
 * @returns {*|{}}
 */
export function getFrameState(){
  return getState()[Fields.globalNamespace] || {};
}

/**
 * 获取路径
 * @returns {*|{}}
 */
export function getPathname(){
  return getFrameState().pathname;
}

/**
 * 设置store
 * @param store
 */
export function setStore(store){
  return setGlobalConfig('store',store);
}

/**
 * 获取store
 * @returns {{}}
 */
export function getStore(){
  return getGlobalConfig('store');
}

/**
 * 获取state
 * @returns {S | S | any | Promise<NavigationPreloadState>}
 */
export function getState(){
  return getStore().getState();
}


/**
 * connect别名
 * @param args
 */
export function reduxConnect(...args){
  return connect(...args);
}
