import {useEffect, useRef, useState} from "react";
import {equal} from "@wangct/util";
import {callFunc, random} from "@wangct/util/lib/util";
import {isFunc} from "@wangct/util/lib/typeUtil";
import {getStore, updateModel} from "./state";

/**
 * redux
  * @param resultFunc
 * @param store
 * @returns {*[]}
 */
export function useRedux(resultFunc,store = getStore()){

  const [refresh,setRefresh] = useState();

  useEffect(() => {
    return store.subscribe(() => {
      const newResult = getResult();
      if(!equal(result,newResult)){
        setRefresh(random());
      }
    });
  });

  function getResult(){
    const state = store.getState();
    return isFunc(resultFunc) ? resultFunc(state) : resultFunc ? state[resultFunc] : state;
  }
  const result = getResult();
  return [result,updateModel];
}

export function useWindowSize(){
  const [size,setSize] = useState({});
  function onResize(){
    setSize({
      width:window.innerWidth,
      height:window.innerHeight,
    });
  }
  useEffectOnce(() => {
    window.addEventListener('resize',onResize);
    return () => {
      window.removeEventListener('resize',onResize);
    }
  });
  return [size,setSize];
}

export function useTimeout(func,timeout = 0){
  useEffect(() => {
    const timer = setTimeout(() => {
      callFunc(func);
    },timeout);
    return () => {
      clearTimeout(timer);
    }
  },[]);
}

export function useInterval(func,interval = 30){
  useEffectOnce(() => {
    const timer = setInterval(() => {
      callFunc(func);
    },interval);
    return () => {
      clearInterval(timer);
    }
  });
}

export function usePrevState(state){
  const ref = useRef(null);
  useEffect(() => {
    ref.current = state;
  });
  return ref.current;
}

export function useEffectOnce(effect){
  return useEffect(effect,[]);
}
