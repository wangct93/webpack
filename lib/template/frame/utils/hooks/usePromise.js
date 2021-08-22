import {useState} from "react";
import useMount from "./useMount";
import {toPromise} from "@wangct/util/lib/promiseUtil";
import {callFunc} from "@wangct/util/lib/util";


export function usePromise(promise,initValue = null,setCb = null){
  const [data,setData] = useState(initValue);
  useMount(() => {
    toPromise(promise).then((result) => {
      setData(result);
      callFunc(setCb,result);
    });
  });
  return data;
}
