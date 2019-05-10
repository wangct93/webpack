

const path = require('path');
const scriptType = process.argv[2] || 'dev';

let cp;

switch (scriptType) {
  case 'init':
  case 'dev':
  case 'build':
    cp = require(path.resolve(__dirname,scriptType));
    break;
}

process.on('exit',() => {
  cp.kill('close');
})