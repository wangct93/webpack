import {useCallback, useState} from "react";


export default function useElem(initRef){
  const [ref,setRefState] = useState(initRef);
  const setRef = useCallback((elem) => {
    setRefState(elem);
  },[]);
  return [ref,setRef];
}
