"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRouterDom = require("react-router-dom");

Object.keys(_reactRouterDom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reactRouterDom[key];
    }
  });
});