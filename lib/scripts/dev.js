const spawn = require('cross-spawn');
const {resolveLib} = require('../config/util');
const util = require('wangct-server-util');
require('../watch').start();

module.exports = spawn('webpack-dev-server.cmd',['--config',resolveLib('config/dev')],{
  stdio:'inherit',
  cwd:util.resolve(),
});
