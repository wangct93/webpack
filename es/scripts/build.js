const {spawn} = require('child_process');
const path = require('path');

module.exports = spawn('webpack.cmd',['--config',path.resolve(__dirname,'../config/build')],{
  stdio:'inherit'
});