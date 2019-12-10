

const {resolve} = require('wangct-server-util');
const spawn = require('cross-spawn');
require('../watch').start();

process.env.env = 'env';

const serverProcess = spawn('webpack-dev-server',['--config',resolve(__dirname,'../config/dev.js')],{
  stdio:'inherit',
  env:process.env,
});
process.on('close',() => {
  serverProcess.kill();
});
