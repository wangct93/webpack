import {createStore as reduxCreateStore} from "redux";
import {aryToObject, callFunc, isFunc, isPromise, objForEach, toAry, toStr} from "@wangct/util";
import history from './history';
import {getConfig} from "../utils/globalUtil";

/**
 * 获取store对象
 * @returns {any}
 */
export function createStore(models){
  const cacheStore = getConfig('store');
  if(cacheStore){
    return cacheStore;
  }
  models = toAry(models);
  const watchPropsMap = getWatchPropsMap(models);
  const store = reduxCreateStore((state,action) => {
    const [namespace,funcField] = (action.type || '').split('/');
    const {reducers = {},effects = {}} = models.find(item => item.namespace === namespace) || {};
    const updateState = {};
    if(!reducers.update){
      reducers.update = update;
    }
    if(!reducers.updateField){
      reducers.updateField = update;
    }
    if(effects[funcField]){
      const gener = effects[funcField](action,{
        put:put.bind(this,namespace),
        select,
        call
      });
      setTimeout(() => {
        loopGenerator(gener);
      },0);
    }
    if(reducers[funcField]){
      const oldState = state[namespace] || {};
      const scopeState = reducers[funcField](oldState,action) || {};
      const watchState = getWatchState(watchPropsMap[namespace],scopeState,oldState);
      updateState[namespace] = {
        ...scopeState,
        ...watchState,
      };
    }
    return {
      ...state,
      ...updateState
    };
  },{});

  /**
   * dispatch
   * @param namespace
   * @param action
   * @returns {Promise<any>}
   */
  function put(namespace,action){
    getStoreDispatch(store,namespace)(action);
    return Promise.resolve(action);
  }

  /**
   * 获取state
   * @param func
   * @returns {Promise<any>}
   */
  function select(func){
    return Promise.resolve(func(store.getState()))
  }

  /**
   * 执行异步函数
   * @param args
   * @returns {Promise<*[]>|*}
   */
  function call(...args){
    const target = args[0];
    if(isPromise(target)){
      return target;
    }else if(isFunc(target)){
      return target(...args.slice(1));
    }else{
      return Promise.resolve(args);
    }
  }

  models.forEach((model) => {
    const {subscriptions,namespace} = model;
    store.dispatch({
      type:model.namespace + '/update',
      field:'multiple',
      data:model.state,
    });
    if(subscriptions){
      setTimeout(() => {
        Object.keys(subscriptions).forEach(key => {
          callFunc(subscriptions[key],{
            dispatch:getStoreDispatch(store,namespace),
            history
          })
        })
      },0);
    }
  });

  return store;
}

/**
 * 获取store的dispatch
 * @param store
 * @param namespace
 * @returns {function(...[*]=)}
 */
export function getStoreDispatch(store,namespace = 'global'){
  return (action) => {
    store.dispatch({
      ...action,
      type:formatType(action.type,namespace)
    })
  }
}

/**
 * 格式化类型
 * @param type
 * @param namespace
 * @returns {string}
 */
function formatType(type = '',namespace){
  const [typespace,funcField] = type.split('/');
  return funcField ? type : namespace + '/' + typespace
}

/**
 * 循环遍历生成器
 * @param gener
 * @param params
 */
function loopGenerator(gener,params){
  const {value,done} = gener.next(params);
  if(!done){
    if(isPromise(value)){
      value.then(data => {
        loopGenerator(gener,data);
      })
    }else{
      loopGenerator(gener,value);
    }
  }
}

/**
 * 更新字段
 * @param state
 * @param field
 * @param data
 * @param parentField
 */
function update(state,{field,data,parentField}){
  let extState = field === 'multiple' ? data : {[field]:data};
  if(parentField){
    extState = {
      [parentField]:{
        ...state[parentField],
        ...extState,
      },
    };
  }
  return {
    ...state,
    ...extState,
  };
}

/**
 * 获取监听属性map
 * @param models
 */
function getWatchPropsMap(models){
  return aryToObject(models,'namespace',((model) => {
    const {watchs = {},watch = watchs} = model;
    const mapData = {};
    objForEach(watch,(value,key) => {
      const temp = key.split(',');
      temp.forEach((itemKey) => {
        const ary = mapData[itemKey] || [];
        ary.push({
          func:value,
          args:temp,
        });
        mapData[itemKey] = ary;
      });
    });
    return mapData;
  }));
}

/**
 * 获取监听的state
 */
function getWatchState(watchProps,state,originState){
  let watchState = {};
  const tempMap = new Map();
  objForEach(watchProps,(value,key) => {
    if(state[key] !== originState[key]){
      toAry(watchProps[key]).forEach((item) => {
        callWatchFunc(item);
      });
    }
  });

  /**
   * 调用监听函数
   * @param data
   */
  function callWatchFunc(data){
    if(tempMap.get(data.func)){
      return;
    }
    tempMap.set(data.func,true);
    const args = toAry(data.args).map((name) => {
      return state[name];
    });
    const funcState = data.func(...args,state);
    watchState = {
      ...watchState,
      ...funcState,
    };
  }

  return watchState;
}
