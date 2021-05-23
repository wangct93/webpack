import {useEffect, useRef} from "react";

export default function usePrevState(state){
  const ref = useRef(null);
  useEffect(() => {
    ref.current = state;
  });
  return ref.current;
}
