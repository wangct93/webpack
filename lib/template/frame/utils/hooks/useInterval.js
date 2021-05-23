import {callFunc} from "@wangct/util/lib/util";
import useMount from "./useMount";

export default function useInterval(func,interval = 30){
  useMount(() => {
    const timer = setInterval(() => {
      callFunc(func);
    },interval);
    return () => {
      clearInterval(timer);
    }
  });
}
