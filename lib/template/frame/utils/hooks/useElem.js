import {useCallback, useState} from "react";

/**
 * 获取原生元素
 * @param initRef
 * @returns {{setElem: Function, getElem: (function(): *)}}
 */
export default function useElem(initRef){
  const [ref,setRefState] = useState(initRef);

  let target = useCallback({
    elem:initRef,
  },[]);

  const getElem = useCallback(() => {
    return target.elem;
  },[]);

  const setElem = useCallback((elem) => {
    target.elem = elem;
    setRefState(elem);
  },[]);
  return [getElem,setElem];
}
