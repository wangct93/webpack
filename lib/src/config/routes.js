"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Test = _interopRequireDefault(require("../../../src/pages/Test/Test"));

var _Test2 = _interopRequireDefault(require("../../../src/pages/Test2/Test2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = [{
  path: '/',
  component: _Test["default"],
  indexPath: '/ttt',
  children: [{
    path: '/ttt',
    component: _Test2["default"]
  }]
}];
exports["default"] = _default;