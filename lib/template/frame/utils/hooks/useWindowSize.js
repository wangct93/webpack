import {useState} from "react";
import useMount from "./useMount";

export default function useWindowSize(){
  const [size,setSize] = useState({
    width:window.innerWidth,
    height:window.innerHeight,
  });
  function onResize(){
    setSize({
      width:window.innerWidth,
      height:window.innerHeight,
    });
  }
  useMount(() => {
    window.addEventListener('resize',onResize);
    return () => {
      window.removeEventListener('resize',onResize);
    }
  });
  return size;
}
