"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _path = _interopRequireDefault(require("path"));

var _history = _interopRequireDefault(require("./history"));

var _routes = _interopRequireDefault(require("../config/routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RootRouter =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(RootRouter, _PureComponent);

  function RootRouter() {
    _classCallCheck(this, RootRouter);

    return _possibleConstructorReturn(this, _getPrototypeOf(RootRouter).apply(this, arguments));
  }

  _createClass(RootRouter, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_reactRouterDom.Router, {
        history: _history["default"]
      }, getRoutes(_routes["default"]));
    }
  }]);

  return RootRouter;
}(_react.PureComponent);

exports["default"] = RootRouter;

function getRoutes(routes, indexPath) {
  return _react["default"].createElement(_reactRouterDom.Switch, null, routes.map(function (_ref) {
    var routePath = _ref.path,
        _ref$component = _ref.component,
        RouteComponent = _ref$component === void 0 ? 'div' : _ref$component,
        _ref$children = _ref.children,
        children = _ref$children === void 0 ? [] : _ref$children,
        indexPath = _ref.indexPath;
    var props = {
      key: routePath,
      path: routePath
    };

    if (children.length) {
      props.render = function (props) {
        return _react["default"].createElement(RouteComponent, props, getRoutes(children.map(function (childRoute) {
          return _objectSpread({}, childRoute, {
            path: _path["default"].join(routePath, childRoute.path)
          });
        }), indexPath && _path["default"].join(routePath, indexPath)));
      };
    } else {
      props.component = RouteComponent;
    }

    return _react["default"].createElement(_reactRouterDom.Route, props);
  }), indexPath ? _react["default"].createElement(_reactRouterDom.Redirect, {
    key: "redirectRoute",
    to: indexPath
  }) : '');
}