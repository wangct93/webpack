const {spawn} = require('child_process');
const {resolveLib} = require('../config/util');

require('../watch').once();

module.exports = spawn('webpack.cmd',['--config',resolveLib('config/build')],{
  stdio:'inherit'
});
