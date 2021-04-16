const {fileIsExist} = require("@wangct/node-util/lib/file");
const {pathResolve} = require("@wangct/node-util/lib/path");
const {toStr} = require("@wangct/util/lib/stringUtil");


module.exports = function(source){
  source = formatDynamic(source);
  if(this.resourcePath.match(/@wangct[\/\\]react[\\\/]lib/)){
    if(fileIsExist(pathResolve(this.resourcePath,'..','index.less'))){
      source = `require("./index.less");\n` + source;
    }
  }
  return source;
};

function formatDynamic(source){
  const re = /import\s+([^;]*?)\s+from\s+['"]@wangct\/react['"];?/g;
  return toStr(source).replace(re,(match,first) => {
    first = first.replace(/^{|}$/g,'');
    const list = first.split(/\s*,\s*/);
    const replaceImportList = list.map((modName) => {
      modName = modName.trim();
      if(!modName){
        return '';
      }

      const isUpper = modName.charAt(0).toUpperCase() === modName.charAt(0);
      if(isUpper){
        return `import ${modName} from '@wangct/react/lib/${modName}';`;
      }
      return `import {${modName}} from '@wangct/react/lib/utils/exportUtil';`;
    });
    return replaceImportList.join('\n');
  });
}
