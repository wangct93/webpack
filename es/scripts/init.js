
const util = require('wangct-server-util');
const path = require('path');

util.copyFile({
  src:path.resolve(__dirname,'../../template'),
  output:path.resolve(process.cwd())
})