"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  "routes": [{
    "path": "/",
    "component": "Test",
    "indexPath": "/ttt",
    "children": [{
      "path": "/ttt",
      "component": "Test2"
    }]
  }],
  "devServer": {
    "port": 3212
  },
  "isSelf": true
};
exports["default"] = _default;