import {useState} from "react";
import {toPromise} from "@wangct/util/lib/promiseUtil";
import {callFunc} from "@wangct/util/lib/util";
import useMount from "./useMount";


export default function usePromise(promise,initValue = null,setCb = null){
  const [data,setData] = useState(initValue);
  useMount(() => {
    refresh();
  });

  function refresh(){
    toPromise(promise).then((result) => {
      setData(result);
      callFunc(setCb,result);
    });
  }

  return [data,refresh];
}
