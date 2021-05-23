import {useEffect} from "react";

export default function useMount(effect){
  return useEffect(effect,[]);
}
