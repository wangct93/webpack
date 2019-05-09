
const {spawn} = require('child_process');
const path = require('path');
const resolve = (...paths) => path.resolve(__dirname,'../..',...paths);

require('./watch');

module.exports = spawn('webpack-dev-server.cmd',['--config',resolve(__dirname,'../config/dev')],{
  stdio:'inherit'
});
