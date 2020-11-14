import {isObj, isStr, stringify} from "@wangct/util";
import history from '../modules/history';
import {getPathname} from "./state";
import {toStr} from "@wangct/util/lib/stringUtil";

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

/**
 * 路径匹配
  * @param targetPath
 * @param pathanme
 * @returns {boolean}
 */
export function pathMatch(targetPath,pathanme = getPathname()){
  return ('/' + toStr(pathanme) + '/').startsWith('/' + toStr(targetPath) + '/');
}
