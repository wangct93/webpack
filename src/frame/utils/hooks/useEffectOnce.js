import {useEffect} from "react";

export default function useEffectOnce(effect){
  return useEffect(effect,[]);
}
