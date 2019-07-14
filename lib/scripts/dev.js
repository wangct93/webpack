
const {spawn} = require('child_process');
const {resolveLib} = require('../config/util');

require('../watch').start();

module.exports = spawn('webpack-dev-server.cmd',['--config',resolveLib('config/dev')],{
  stdio:'inherit'
});
