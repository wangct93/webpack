import {Flex} from '@wangct/react';
import {toAry,callFunc} from '@wangct/util';
import {getConfig,setConfig} from './globalUtil';


export function cbGetList(field){
  return toAry(getConfig(getField(field)));
}

function getField(field){
  return 'callback_list_' + field;
}

export function callbackAdd(field,cb = null){
  setConfig(getField(field),[...cbGetList(field),cb]);
}

export function callbackClear(field,cb = null){
  const cbField = getField(field);
  if(cb == null){
    setConfig(cbField,[]);
  }else{
    setConfig(cbField,cbGetList(field).filter((item) => item !== cb));
  }
}

export function callbackExec(field,...args){
  cbGetList(field).forEach((item) => {
    callFunc(item,...args);
  });
}
