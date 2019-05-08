const {spawn} = require('child_process');
const path = require('path');
const resolve = (...paths) => path.resolve(__dirname,'../..',...paths);

spawn('webpack.cmd',['--config',resolve('lib/config/build')],{
  stdio:'inherit'
});