import {useState} from "react";
import {isFunc, isNum} from "@wangct/util/lib/typeUtil";


export default function useList(initList = []){
    const [list,setList] = useState(initList);

    const actions = {
        set(newList){
            setList(newList);
        },
        push (...args) {
            setList([list,...args]);
        },
        update (func, item) {
            let filterFunc;
            if(isNum(func)){
                filterFunc = (item,index) => index === func;
            }else if(isFunc(func)){
                filterFunc = func;
            }else{
                filterFunc = (item) => item === func;
            }
            const newList = list.slice(0);
            newList.forEach((forItem,index) => {
                if(filterFunc(forItem,index)){
                    newList[index] = item;
                }
            });
            setList(newList);
            return newList;
        },
        sort (compareFn) {
            const newList = list.sort(compareFn);
            setList(newList);
            return newList;
        },
        filter (func) {
            let filterFunc;
            if(isNum(func)){
                filterFunc = (item,index) => index === func;
            }else if(isFunc(func)){
                filterFunc = func;
            }else{
                filterFunc = (item) => item === func;
            }
            const newList = list.filter(filterFunc);
            setList(newList);
            return newList;
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
            const newList = list.filter((item,index) => !removeFunc(item,index));
            setList(newList);
            return newList;
        },
        clear () {
            const newList = [];
            setList(newList);
            return newList;
        },
        reset () {
            setList(initList);
            return initList;
        },
    };
    return [list,actions];
}

