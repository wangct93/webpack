"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = request;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _window = window,
    fetch = _window.fetch;
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

function request(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var newOptions = formatOptions(options);
  return fetch(url, newOptions).then(checkStatus).then(parseJSON)["catch"](function () {
    return {
      status: 0,
      message: '连接服务器失败！'
    };
  }).then(function (json) {
    return json.status ? Promise.resolve(json) : Promise.reject(json);
  });
}

function formatOptions(options) {
  var body = options.body;

  if (body && !(body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
    options.headers = _objectSpread({}, options.headers, {
      'content-type': 'application/json'
    });
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

  var error = new Error(response.statusText);
  error.response = response;
  throw error;
}