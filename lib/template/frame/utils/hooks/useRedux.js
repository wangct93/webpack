import {useEffect, useState} from "react";
import {equal} from "@wangct/util";
import { random} from "@wangct/util/lib/util";
import {isFunc} from "@wangct/util/lib/typeUtil";
import {getStore} from "../state";

export default function useRedux(resultFunc,store = getStore()){

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
  return result;
}








