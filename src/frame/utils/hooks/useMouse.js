import {useState} from "react";
import useMount from "./useMount";

export default function useMouse(){

  const [pos,setPos] = useState({});

  useMount(() => {
    function move(e){
      setPos({
        x:e.clientX,
        y:e.clientY,
      });
    }
    document.addEventListener('mousemove',move);
    return () => {
      document.removeEventListener('mousemove',move);
    }
  });

  return pos;
}








