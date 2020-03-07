

const {resolve} = require('wangct-server-util');
const spawn = require('cross-spawn');
const {EnumEnv} = require("../utils/options");
require('../watch').start();

process.env.env = EnumEnv.dev;

spawn('webpack-dev-server',['--config',resolve(__dirname,'../config/dev.js')],{
  stdio:'inherit',
  env:process.env,
});
