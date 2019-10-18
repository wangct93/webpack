const spawn = require('cross-spawn');
const {resolveLib} = require('../config/util');
const util = require('wangct-server-util');
require('../watch').once();

const webpack = require('webpack');
const config = require(resolveLib('config/build'));
webpack(config).run();

// module.exports = spawn('node_modules/.bin/webpack.cmd',['--config',resolveLib('config/build')],{
//   stdio:'inherit',
//   cwd:util.resolve(),
// });
