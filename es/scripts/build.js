const {spawn} = require('child_process');
const path = require('path');
const resolve = (...paths) => path.resolve(__dirname,'../..',...paths);

module.exports = spawn('webpack.cmd',['--config',resolve(__dirname,'../config/build')],{
  stdio:'inherit'
});