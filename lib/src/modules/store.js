"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStore = getStore;
exports["default"] = void 0;

var _redux = require("redux");

var _wangctUtil = _interopRequireWildcard(require("wangct-util"));

var _models = _interopRequireDefault(require("../config/models"));

var _history = _interopRequireDefault(require("./history"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = getStore(_models["default"]);

exports["default"] = _default;

function getStore(models) {
  var _this = this;

  var store = (0, _redux.createStore)(function (state, action) {
    var _split = (action.type || '').split('/'),
        _split2 = _slicedToArray(_split, 2),
        namespace = _split2[0],
        funcField = _split2[1];

    var _ref = models.find(function (item) {
      return item.namespace === namespace;
    }) || {},
        _ref$reducers = _ref.reducers,
        reducers = _ref$reducers === void 0 ? {} : _ref$reducers,
        _ref$effects = _ref.effects,
        effects = _ref$effects === void 0 ? {} : _ref$effects;

    var updateState = {};

    if (effects[funcField]) {
      var gener = effects[funcField](action, {
        put: put.bind(_this, namespace),
        select: select,
        call: call
      });
      loopGenerator(gener);
    }

    if (reducers[funcField]) {
      updateState[namespace] = reducers[funcField](state[namespace], action);
    }

    return _objectSpread({}, state, updateState);
  }, _wangctUtil.arrayUtil.toObject(models, 'namespace', function (item) {
    return item.state;
  }));

  function put(namespace, action) {
    getDispatch(namespace)(action);
    return Promise.resolve(action);
  }

  function select(func) {
    return Promise.resolve(func(store.getState()));
  }

  function call() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var target = args[0];

    if (_wangctUtil["default"].isPromise(target)) {
      return target;
    } else if (_wangctUtil["default"].isFunc(target)) {
      return target.apply(void 0, _toConsumableArray(args.slice(1)));
    } else {
      return Promise.resolve(args);
    }
  }

  models.forEach(function (_ref2) {
    var subscriptions = _ref2.subscriptions,
        namespace = _ref2.namespace;

    if (subscriptions) {
      Object.keys(subscriptions).forEach(function (key) {
        _wangctUtil["default"].callFunc(subscriptions[key], {
          dispatch: getDispatch(namespace),
          history: _history["default"]
        });
      });
    }
  });

  function getDispatch() {
    var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'global';
    return function (action) {
      store.dispatch(_objectSpread({}, action, {
        type: formatType(action.type, namespace)
      }));
    };
  }

  function formatType() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var namespace = arguments.length > 1 ? arguments[1] : undefined;

    var _type$split = type.split('/'),
        _type$split2 = _slicedToArray(_type$split, 2),
        typespace = _type$split2[0],
        funcField = _type$split2[1];

    return funcField ? type : namespace + typespace;
  }

  return store;
}

function loopGenerator(gener, params) {
  var _gener$next = gener.next(params),
      value = _gener$next.value,
      done = _gener$next.done;

  if (!done) {
    if (_wangctUtil["default"].isPromise(value)) {
      value.then(function (data) {
        loopGenerator(gener, data);
      });
    } else {
      loopGenerator(gener, value);
    }
  }
}