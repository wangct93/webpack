import {useEffect} from "react";
import {callFunc} from "@wangct/util/lib/util";

export default function useTimeout(func,timeout = 0){
  useEffect(() => {
    const timer = setTimeout(() => {
      callFunc(func);
    },timeout);
    return () => {
      clearTimeout(timer);
    }
  },[]);
}
