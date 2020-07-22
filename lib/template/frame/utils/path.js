import {isObj, isStr, stringify} from "util-1";
import history from '../modules/history';

/**
 * 路径合并
 * @param args
 * @returns {string}
 */
export function pathJoin(...args){
  return args.join('/').replace(/\/+/g,'/');
}

/**
 * 路径跳转
 * @param path
 * @param qsParams
 * @param hash
 */
export function pathTo(path,qsParams = false,hash = false){
  const qsString = isObj(qsParams) ? stringify(qsParams) : qsParams ? location.search.substr(1) : '';
  if(qsString){
    path += path.includes('?') ? '&' : '?';
    path += qsString;
  }
  if(hash){
    path += isStr(hash) ? '#' + hash : location.hash;
  }
  return history.push(path);
}
