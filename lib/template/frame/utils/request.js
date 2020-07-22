const {fetch} = window;

/**
 * 请求方法
 * @param url
 * @param options
 * @returns {*}
 */
export default function request(url, options = {}) {
  options = formatOptions(options);
  return fetch(url,options)
    .then(checkStatus)
    .then((res) => {
      const {json = true,blob,text} = options;
      if(blob){
        return res.blob();
      }else if(text){
        return res.text();
      }else if(json){
        return res.json();
      }
      return res;
    })
}


/**
 * 格式化选项
 * @param options
 * @returns {*}
 */
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
