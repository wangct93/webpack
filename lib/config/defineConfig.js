const path = require('path');
let defineConfig = {};
try{
  defineConfig = require(path.resolve(process.cwd(),'config/config'));
}catch(e){}

module.exports = defineConfig;