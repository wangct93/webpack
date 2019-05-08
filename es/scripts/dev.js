
const {spawn} = require('child_process');
const path = require('path');
const resolve = (...paths) => path.resolve(__dirname,'../..',...paths);

require('./watch');

spawn('webpack-dev-server.cmd',['--config',resolve('lib/config/dev')],{
  stdio:'inherit'
});
