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








