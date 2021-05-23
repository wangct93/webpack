import {useEffect, useState} from "react";

export default function useHover(elem){
  const [hover,setHover] = useState(false);

  useEffect(() => {
      const enterFunc = () => {
          setHover(true);
      };
      const leaveFunc = () => {
          setHover(false);
      };
      if(elem){
          elem.addEventListener('mouseenter',enterFunc);
          elem.addEventListener('mouseleave',leaveFunc);
      }

      return () => {
          if(elem){
              elem.removeEventListener('mouseenter',enterFunc);
              elem.removeEventListener('mouseleave',leaveFunc);
          }
      }
  },[elem]);

  return hover;
}



