const {pathFilename} = require("@wangct/node-util/lib/path");
const {pathDirname} = require("@wangct/node-util/lib/path");
const {pathResolve} = require("@wangct/node-util/lib/path");

const output = pathResolve('lib/template/frame/utils/hooks/index.js');

start();

async function start(){
  console.log('生成 hooks/index.js');
  console.log('开始');
  const fs = require('fs');
  const time = +new Date();
  const dirname = pathDirname(output);
  let list = fs.readdirSync(dirname);
  list = list.filter(item => {
    return item !== 'index.js';
  }).map((item) => pathFilename(item,false));
  const importContents = list.map(item => `import ${item} from './${item}';`);
  let content = `${importContents.join('')} export {${list.join(',')}};`;
  fs.writeFileSync(output,content);
  console.log(`结束 ：${output} 用时：${+new Date() - time}ms`);
}
