import {createStore} from "redux";
import {aryToObject, callFunc, isFunc, isPromise, objForEach, toAry, toStr} from "util-1";
import history from './history';

/**
 * 获取store对象
 * @returns {any}
 */
export function getStore(models){
  models = toAry(models);
  const watchPropsMap = getWatchPropsMap(models);
  const store = createStore((state,action) => {
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
      let scopeState = reducers[funcField](state[namespace],action);
      const oldScopeState = state[namespace];
      if(scopeState._type === 'init'){
        scopeState = scopeState.data;
      }
      const watchState = getWatchState(scopeState,watchPropsMap[namespace],oldScopeState);
      updateState[namespace] = {
        ...oldScopeState,
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
      Object.keys(subscriptions).forEach(key => {
        callFunc(subscriptions[key],{
          dispatch:getStoreDispatch(store,namespace),
          history
        })
      })
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
  return extState;
}

/**
 * 获取监听属性map
 * @param models
 */
function getWatchPropsMap(models){
  return aryToObject(models,'namespace',((model) => {
    const {watch = {}} = model;
    const mapData = {};
    const objPropMapData = {};
    objForEach(watch,(value,key) => {
      const temp = key.split(',');
      temp.forEach((itemKey) => {
        const data = itemKey.includes('.') ? objPropMapData : mapData;
        const ary = data[itemKey] || [];
        ary.push({
          func:value,
          args:temp,
        });
        data[itemKey] = ary;
      });
    });
    return {
      propMap:mapData,
      objPropMap:objPropMapData,
    };
  }));
}

/**
 * 获取监听的state
 * @param state
 * @param watchPropsMap
 * @param originState
 */
function getWatchState(state,{propMap = {},objPropMap = {}},originState){
  let watchState = {};
  const changedCache = {};
  const tempMap = new Map();
  const realState = {
    ...originState,
    ...state,
  };
  objForEach(state,(value,key) => {
    toAry(propMap[key]).forEach((item) => {
      callWatchFunc(item);
    });
  });
  objForEach(objPropMap,(value,key) => {
    if(isChanged(key)){
      value.forEach((item) => {
        callWatchFunc(item);
      });
    }
  });

  /**
   * 字段值是否改变
   * @param field
   * @returns {boolean|*}
   */
  function isChanged(field){
    if(changedCache[field] !== undefined){
      return changedCache[field];
    }
    const result = getValueByWatchField(realState,field) !== getValueByWatchField(originState,field);
    changedCache[field] = result;
    return result;
  }

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
      const [field] = name.split('.');
      return realState[field];
    });
    const funcState = data.func(...args);
    watchState = {
      ...watchState,
      ...funcState,
    };
  }

  return watchState;
}

/**
 * 根据监听字段获取对应值
 * @param state
 * @param field
 * @returns {*}
 */
function getValueByWatchField(state = {},field){
  toStr(field).split('.').forEach(field => {
    if(state){
      state = state[field];
    }
  });
  return state;
}
