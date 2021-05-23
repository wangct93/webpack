const {spawn} = require("@wangct/node-util/lib/spawn");

start();

async function start() {
  await spawn('npm',['run','hook']);
  await spawn('npm',['run','pu-cmd']);
}
