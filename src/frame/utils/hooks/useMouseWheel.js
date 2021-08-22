import {useEffect, useState} from "react";
import useMount from "./useMount";
import {getThrottleFunc} from "@wangct/util/lib/util";

export default function useMouseWheel(elem = document){

  const [scale,setScale] = useState(1);

  useEffect(() => {
    const wheel = getThrottleFunc((e) => {
      const isEnlarge = e.deltaY < 0;
      const enlargeScale = isEnlarge ? 1.2 : 1 / 1.2;
      setScale(scale * enlargeScale);
    });
    elem.addEventListener('wheel',wheel);
    return () => {
      elem.removeEventListener('wheel',wheel);
    }
  });

  return scale;
}








