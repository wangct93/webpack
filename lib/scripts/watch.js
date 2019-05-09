"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by wangct on 2018/8/28.
 */
var fs = require('fs');

var path = require('path');

var resolveApp = function resolveApp() {
  for (var _len = arguments.length, dir = new Array(_len), _key = 0; _key < _len; _key++) {
    dir[_key] = arguments[_key];
  }

  return path.resolve.apply(path, [process.cwd()].concat(dir));
};

var Babel = require('wangct-babel');

var util = require('wangct-server-util');

var arrayUtil = util.arrayUtil;

var resolve = function resolve() {
  for (var _len2 = arguments.length, dir = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    dir[_key2] = arguments[_key2];
  }

  return path.resolve.apply(path, [__dirname, '../..'].concat(dir));
};

var defineConfig = require('../config/defineConfig');

var libDirname = defineConfig.isSelf ? 'es' : 'lib';
var modelDirname = resolveApp('src/models');
var configDirname = resolveApp('config');
var pageDirname = resolveApp('src/pages');
var componentConfigPath = resolveApp('src/components/config.js');
var modelOutputPath = resolve(libDirname, 'src/config/models.js');
var routerOutputPath = resolve(libDirname, 'src/config/routes.js');
var componentOutput = resolveApp('src/components/index.js');
var tempDirname = resolve('temp');
util.mkdir(modelOutputPath);
util.mkdir(routerOutputPath);
util.mkdir(componentOutput);
util.mkdir(tempDirname);
var options = [{
  src: modelDirname,
  callback: updateModel,
  error: function error() {
    fs.writeFileSync(modelOutputPath, "export default []");
  }
}, {
  src: configDirname,
  callback: updateRouter,
  error: function error() {
    fs.writeFileSync(routerOutputPath, "export default []");
    fs.writeFileSync(resolve(routerOutputPath, '../config.js'), 'export default {}');
  }
}, {
  src: componentConfigPath,
  callback: updateComponent
}];
options.forEach(function (opt) {
  fs.stat(opt.src, function (err) {
    if (err) {
      util.callFunc(opt.error);
    } else {
      util.watch(opt);
    }
  });
});

function updateModel(cb) {
  var time = +new Date();
  console.log('开始生成 model');
  fs.readdir(modelDirname, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var importAry = [];
      var modelNameAry = data.map(function (item) {
        var filePath = resolve(modelDirname, item);
        var relativePath = path.relative(path.resolve(modelOutputPath, '..'), filePath).replace(/\\/g, '/');
        var fileName = path.basename(item, path.extname(item)) + '_' + +new Date();

        if (relativePath.charAt(0) !== '.') {
          relativePath = './' + relativePath;
        }

        importAry.push("import ".concat(fileName, " from '").concat(relativePath, "';"));
        return fileName;
      });
      var content = "".concat(importAry.join(''), " export default [").concat(modelNameAry.join(','), "];");
      util.mkdir(modelOutputPath);
      fs.writeFile(modelOutputPath, content, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("\u6210\u529F\u751F\u6210 model \uFF1A".concat(modelOutputPath, " \u7528\u65F6\uFF1A").concat(+new Date() - time, "ms"));

          if (typeof cb === 'function') {
            cb();
          }
        }
      });
    }
  });
}

function updateRouter(cb) {
  var time = +new Date();
  console.log('开始生成 router');
  Object.keys(require.cache).forEach(function (key) {
    if (key.includes(configDirname)) {
      delete require.cache[key];
    }
  });

  var config = require(resolve(configDirname, 'config'));

  var content = getRouterContent(_objectSpread({}, config, {
    output: routerOutputPath
  }));
  util.mkdir(routerOutputPath);
  fs.writeFile(routerOutputPath, content, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("\u6210\u529F\u751F\u6210 router \uFF1A".concat(routerOutputPath, " \u7528\u65F6\uFF1A").concat(+new Date() - time, "ms"));
      util.callFunc(cb);
    }
  });
  var configOutputPath = resolve(routerOutputPath, '..', 'config.js');
  fs.writeFile(configOutputPath, 'export default ' + JSON.stringify(config), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("\u6210\u529F\u751F\u6210 config \uFF1A".concat(configOutputPath, " \u7528\u65F6\uFF1A").concat(+new Date() - time, "ms"));
    }
  }); // new Babel({
  //   src:configDirname,
  //   output,
  //   success(){
  //     Object.keys(require.cache).forEach(key => {
  //       if(key.includes(output)){
  //         delete require.cache[key];
  //       }
  //     });
  //
  //     const config = require(resolve(output,'config')).default;
  //     const content = getRouterContent({
  //       ...config,
  //       output:routerOutputPath,
  //     });
  //     util.mkdir(routerOutputPath);
  //     fs.writeFile(routerOutputPath,content,(err) => {
  //       if(err){
  //         console.log(err);
  //       }else{
  //         console.log(`成功生成 router ：${routerOutputPath} 用时：${+new Date() - time}ms`);
  //         util.callFunc(cb);
  //       }
  //     });
  //   }
  // });
}

function getRouterContent(option) {
  var _option$routes = option.routes,
      routes = _option$routes === void 0 ? [] : _option$routes,
      output = option.output,
      _option$isRoot = option.isRoot,
      isRoot = _option$isRoot === void 0 ? true : _option$isRoot,
      _option$importList = option.importList,
      importList = _option$importList === void 0 ? [] : _option$importList;
  var filterFields = ['component', 'children'];
  var valueContent = routes.map(function (item) {
    var valueContent = Object.keys(item).map(function (key) {
      var value = item[key];

      if (key === 'component') {
        var relativePath = path.relative(path.dirname(output), resolve(pageDirname, value, value)).replace(/\\/g, '/');
        var _item$dynamic = item.dynamic,
            dynamic = _item$dynamic === void 0 ? option.dynamicImport : _item$dynamic;

        if (dynamic) {
          importList.push("import Async from 'wangct-react/lib/Async';\n");
          value = "(props) => <Async {...props} getComponent={() => import('".concat(relativePath, "')} />");
        } else {
          value = 'c_' + util.random();
          importList.push("import ".concat(value, " from '").concat(relativePath, "';\n"));
        }
      } else if (key === 'children') {
        value = getRouterContent(_objectSpread({}, option, {
          routes: value,
          isRoot: false,
          importList: importList
        }));
      }

      return "".concat(key, ":").concat(util.isString(value) && !filterFields.includes(key) ? "'".concat(value, "'") : value.toString());
    }).join(',\n');
    return "{".concat(valueContent, "}");
  }).join(',\n');
  var content = "[".concat(valueContent, "]");
  return isRoot ? "".concat(arrayUtil.noRepeat(importList).join(''), "export default ").concat(content) : content;
}

function updateComponent() {
  console.log('开始生成 components/index.js');
  var time = +new Date();
  var output = resolve(tempDirname, 'components/config.js');
  util.mkdir(output);
  new Babel({
    src: componentConfigPath,
    output: output,
    success: function success() {
      Object.keys(require.cache).forEach(function (key) {
        if (key.includes(output)) {
          delete require.cache[key];
        }
      });

      var config = require(output)["default"];

      var _config$components = config.components,
          components = _config$components === void 0 ? [] : _config$components;
      var importAry = [];
      var modelNameAry = components.map(function (item) {
        var filePath = resolve(componentConfigPath, '..', item);
        var relativePath = path.relative(path.resolve(componentOutput, '..'), filePath).replace(/\\/g, '/');

        if (relativePath.charAt(0) !== '.') {
          relativePath = './' + relativePath;
        }

        importAry.push("import ".concat(item, " from '").concat(relativePath, "';"));
        return item;
      });
      var content = "".concat(importAry.join(''), " export {").concat(modelNameAry.join(','), "};");
      fs.writeFile(componentOutput, content, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("\u6210\u529F\u751F\u6210 components/index.js \uFF1A".concat(componentOutput, " \u7528\u65F6\uFF1A").concat(+new Date() - time, "ms"));

          if (typeof cb === 'function') {
            cb();
          }
        }
      });
    }
  });
}

process.on('uncaughtException', function (err) {
  console.log(err);
});
process.on('unhandledRejection', function (err, promise) {
  console.log('error:', err);
});