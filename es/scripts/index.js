

const {fork} = require('child_process');
const path = require('path');
const scriptType = process.argv[2] || 'dev';
switch (scriptType) {
  case 'dev':
  case 'build':
    fork(path.resolve(__dirname,scriptType));
    break;
}

