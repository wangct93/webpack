import {message} from 'antd';
const {fetch} = window;


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const newOptions = formatOptions(options);
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .catch(() => ({success:false,message:'连接服务器失败！'}))
    .then(json => {
      if(json.success){
        return Promise.resolve(json.data);
      }else{
        if(options.errorAlert){
          message.error(json.message);
        }
        return Promise.reject(json.message);
      }
    });
}


function formatOptions(options){
  const {body} = options;
  if(body && !(body instanceof FormData)){
    options.body = JSON.stringify(options.body);
    options.headers = {
      ...options.headers,
      'content-type':'application/json'
    }
  }
  return options;
}


function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}