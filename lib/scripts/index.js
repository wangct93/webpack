"use strict";

var path = require('path');

var scriptType = process.argv[2] || 'dev';
var cp;

switch (scriptType) {
  case 'init':
  case 'dev':
  case 'build':
    cp = require(path.resolve(__dirname, scriptType));
    break;
}

process.on('exit', function () {
  cp.kill('close');
});