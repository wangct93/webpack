"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _history = require("history");

var _wangctUtil = require("wangct-util");

var _config = _interopRequireDefault(require("../config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var history = _config["default"].history === 'hash' ? (0, _history.createHashHistory)() : (0, _history.createBrowserHistory)();

_wangctUtil.reactUtil.setHistory(history);

var _default = history;
exports["default"] = _default;