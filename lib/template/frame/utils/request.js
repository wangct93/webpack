import {isStr} from "@wangct/util/lib/typeUtil";
import {getGlobalConfig, isDevEnv, setGlobalConfig, showLoading} from "./utils";
import {alertErrInfo} from "./alert";

const {fetch} = window;

/**
 * 请求方法
 * @param url
 * @param options
 * @returns {*}
 */
export default function request(url, options = {}) {
  options = formatOptions(options);
  let pro = fetch(url,options)
    .then(checkStatus)
    .then((res) => {
      const {json = true,blob,text} = options;
      if(blob){
        return res.blob();
      }else if(text){
        return res.text();
      }else if(json){
        return res.json().then((data) => {
          const {matchData = true,alertError = true} = options;
          if(!matchData){
            return data;
          }
          if(data.code !== 0){
            if(alertError && isStr(data.message)){
              alertErrInfo(data.message)
            }
            throw data.message;
          }
          return data.data;
        });
      }
      return res;
    }).catch(() => {
      throw '请求失败';
    });

  if(options.loading){
    pro = showLoading(pro);
  }
  return pro;
}

/**
 * api请求
  * @param url
 * @param options
 */
export function requestApi(url,options = {}){
  if(isDevEnv()){
    return request('/api' + url,options);
  }
  return request(url,options);
}

/**
 * 字典请求
 */
export async function requestCache(url,needCache = true){
  const func = () => {
    return requestApi(url);
  };
  if(!needCache){
    return func();
  }
  let data = getGlobalConfig(url);
  if(!data){
    data = await func();
    setGlobalConfig(url,data);
  }
  return data;
}

/**
 * 格式化选项
 * @param options
 * @returns {*}
 */
function formatOptions(options){
  const {body,method = 'post'} = options;
  if(body && !(body instanceof FormData)){
    if(options.formatBody !== false){
      options.body = JSON.stringify(options.body);
    }
    options.headers = {
      ...options.headers,
      'content-type':'application/json'
    }
  }
  options.method = method;
  return options;
}

/**
 * 检测状态
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
  const {status} = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
