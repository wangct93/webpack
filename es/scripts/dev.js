
const {spawn} = require('child_process');
const path = require('path');

require('./watch').start();

module.exports = spawn('webpack-dev-server.cmd',['--config',path.resolve(__dirname,'../config/dev')],{
  stdio:'inherit'
});
