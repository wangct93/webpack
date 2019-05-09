"use strict";

var _require = require('child_process'),
    spawn = _require.spawn;

var path = require('path');

var resolve = function resolve() {
  for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return path.resolve.apply(path, [__dirname, '../..'].concat(paths));
};

require('./watch');

module.exports = spawn('webpack-dev-server.cmd', ['--config', resolve(__dirname, '../config/dev')], {
  stdio: 'inherit'
});