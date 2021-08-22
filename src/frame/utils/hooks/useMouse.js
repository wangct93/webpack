import {useEffect, useState} from "react";
import useMount from "./useMount";
import {getThrottleFunc} from "@wangct/util/lib/util";

export default function useMouse(elem = document){

  const [pos,setPos] = useState({
    x:0,
    y:0,
  });

  useEffect(() => {
    const move = getThrottleFunc((e) => {
      setPos({
        x:e.clientX,
        y:e.clientY,
      });
    });
    console.log(elem);
    elem.addEventListener('mousemove',move);
    return () => {
      elem.removeEventListener('mousemove',move);
    }
  },[elem]);

  return pos;
}








