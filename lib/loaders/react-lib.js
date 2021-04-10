const {fileIsExist} = require("@wangct/node-util/lib/file");
const {pathResolve} = require("@wangct/node-util/lib/path");
const {toStr} = require("@wangct/util/lib/stringUtil");


module.exports = function(source){
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
        let importStr = `import ${modName} from '@wangct/react/lib/${modName}';`;
        const cssPath = pathResolve(`node_modules/@wangct/react/lib/${modName}/index.less`);
        if(fileIsExist(cssPath)){
          importStr += `\nimport '@wangct/react/lib/${modName}/index.less';`;
        }
        return importStr;
      }
      return `import {${modName}} from '@wangct/react/lib/utils/exportUtil';`;
    });
    return replaceImportList.join('\n');
  });
};
