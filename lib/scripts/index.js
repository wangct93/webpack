"use strict";

var _require = require('child_process'),
    fork = _require.fork;

var path = require('path');

var scriptType = process.argv[2] || 'dev';

switch (scriptType) {
  case 'dev':
  case 'build':
    fork(path.resolve(__dirname, scriptType));
    break;
}