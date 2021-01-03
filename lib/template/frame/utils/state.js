import {connect} from "react-redux";
import {getGlobalConfig, setGlobalConfig} from "./utils";
import {Fields} from "../json/dic";
import {isObj} from "@wangct/util";
import {toAry} from "@wangct/util/lib/arrayUtil";
import {getStoreDispatch} from "../modules/store";
import {random} from "@wangct/util/lib/util";
import React from "react";

/**
 * 是否为选项卡路由
  */
export function isTabRouter(){
  return getFrameState().isTabRouter;
}

/**
 * 获取框架state
 * @returns {*|{}}
 */
export function getFrameState(){
  return getState(Fields.globalNamespace);
}

/**
 * 设置框架state
 * @returns {*|{}}
 */
export function setFrameState(state = {}){
  return updateModel(Fields.globalNamespace,state);
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
 * @param namespace
 * @returns {*|{}}
 */
export function getState(namespace = null){
  const state = getStore().getState();
  const namespaceState = namespace ? state[namespace] : state;
  return namespaceState || {};
}

window.getState = getState;

/**
 * connect别名
 * @param args
 */
export function reduxConnect(...args){
  return connect(...args);
}

/**
 * 获取窗口标志
 */
export function getResizeSign(){
  return getFrameState().resizeSign;
}

/**
 * 获取路由
 */
export function getRoutes(){
  return toAry(getFrameState().routes);
}

/**
 * 设置路由
 * @param routes
 */
export function setRoutes(routes){
  setFrameState({
    routes,
  });
}

/**
 * 获取内容片段
 */
export function getFragmentList(){
  return toAry(getFrameState().fragmentList);
}

/**
 * 设置内容片段
 * @param fragmentList
 */
export function setFragmentList(fragmentList){
  setFrameState({
    fragmentList:toAry(fragmentList),
  });
}

/**
 * 添加内容片段
 */
export function addFragment(content){
  if(!React.isValidElement(content)){
    const Com = content;
    content = <Com key={random()} />
  }
  setFragmentList([...getFragmentList(),content]);
  return {
    close:() => {
      removeFragment(content);
    },
  };
}

/**
 * 删除内容片段
 * @param content
 */
export function removeFragment(content){
  const fragmentList = getFragmentList().filter((item) => item !== content);
  setFragmentList(fragmentList);
}

/**
 * 更新model
 * @param namespace
 * @param type
 * @param data
 */
export function updateModel(namespace = 'global',type,data){
  const dispatch = getStoreDispatch(getStore(),namespace);
  if(isObj(type)){
    dispatch({
      type:'update',
      field:'multiple',
      data:type,
    });
  }else{
    dispatch({
      ...data,
      type,
    });
  }
}

/**
 * 获取dispatch方法
 * @param namespace
 * @returns {function(...[*]=)}
 */
export function getDispatch(namespace){
  return (...args) => {
    return updateModel(namespace,...args);
  };
}

/**
 * dispatch
 * @param args
 */
export function dispatch(...args){
  return updateModel(...args);
}
