start();


function start(){
  const path = require('path');
  const scriptType = process.argv[2] || 'dev';
  const mapData = {
    dev:'start',
    build:'build',
  };
  const scriptName = mapData[scriptType] || mapData.dev;
  require(path.resolve(__dirname,'scripts',scriptName));
}
