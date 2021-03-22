const {getCmdParams} = require("@wangct/node-util/lib/system");
start();


function start(){
  const path = require('path');
  const params = getCmdParams();
  const scriptType = params[0] || 'dev';
  const mapData = {
    dev:'start',
    build:'build',
    frame:'frame',
  };
  const scriptName = mapData[scriptType] || mapData.dev;
  const mod = require(path.resolve(__dirname,'scripts',scriptName));
  if(mod && mod.start){
    mod.start();
  }
}
