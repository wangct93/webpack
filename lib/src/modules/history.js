"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _history = require("history");

var _wangctUtil = require("wangct-util");

var history = (0, _history.createBrowserHistory)();

_wangctUtil.reactUtil.setHistory(history);

var _default = history;
exports["default"] = _default;