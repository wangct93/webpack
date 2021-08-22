import {useState} from "react";
import {isFunc, isNum} from "@wangct/util/lib/typeUtil";
import {usePromise} from "./usePromise";


export default function useMap(initMap = {}){
    const [map,setMap] = useState({});
    usePromise(initMap,map,setMap);

    const actions = {
        setAll(newMap){
            setMap(newMap);
        },
        set(key,value){
            const newMap = {
                ...map,
                [key]:value,
            };
            setMap(newMap);
            return newMap;
        },
        remove (func) {
            let removeFunc;
            if(isNum(func)){
                removeFunc = (item,index) => index === func;
            }else if(isFunc(func)){
                removeFunc = func;
            }else{
                removeFunc = (item) => item === func;
            }
            const newMap = list.filter((item,index) => !removeFunc(item,index));
            setMap(newMap);
            return newMap;
        },
        clear () {
            const newMap = {};
            setMap(newMap);
            return newMap;
        },
        reset () {
            setMap(initMap);
            return initMap;
        },
    };
    return [map,actions];
}

