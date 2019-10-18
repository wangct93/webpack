
const path = require('path');
const scriptType = process.argv[2] || 'dev';
const {resolveLib} = require('./config/util');

let cp;

switch (scriptType) {
  case 'dev':
  case 'build':
    cp = require(resolveLib('scripts',scriptType));
    break;
}

process.on('exit',() => {
  try{
    cp && cp.kill && cp.kill();
  }catch(e){
    console.log(e);
  }
});
