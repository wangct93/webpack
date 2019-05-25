/**
 * Created by wangct on 2018/8/28.
 */

const fs = require('fs');
const path = require('path');
const Babel = require('wangct-babel');
const util = require('wangct-server-util');
const {getJsRule,resolve} = require('./config/util');
const {arrayUtil} = util;

const defineConfig = require('./config/defineConfig');
const {resolve:resolveRoot} = util;

const modelDirname = resolveRoot('src/models');
const configDirname = resolveRoot('config');
const pageDirname = defineConfig.pageDirname || resolveRoot('src/pages');
const componentConfigPath = resolveRoot('src/components/config.js');


const configOutputDirname = resolveRoot('src/_entry/config');

const componentOutput = resolveRoot('src/components/index.js');
const tempDirname = resolve('temp');



util.mkdir(configOutputDirname);
util.mkdir(tempDirname);

const options = [
  {
    src:modelDirname,
    callback:updateModel
  },
  {
    src:configDirname,
    callback:updateRouter
  },
  {
    src:componentConfigPath,
    callback:updateComponent
  }
];

exports.once = once;
exports.start = start;

function once(){
  options.forEach(opt => {
    util.callFunc(opt.callback);
  });
}


function start(){
  options.forEach(opt => {
    util.watch(opt);
  });
}


function updateModel(){
  const time = +new Date();
  console.log('开始生成 model');
  const modelOutputPath = path.join(configOutputDirname,'models.js');
  const list = fs.readdirSync(modelDirname);
  let importAry = [];
  let modelNameAry = list.map(item => {
    let filePath = resolve(modelDirname,item);
    let relativePath = path.relative(path.resolve(modelOutputPath,'..'),filePath).replace(/\\/g,'/');
    let fileName = path.basename(item,path.extname(item)) + '_' + +new Date();
    if(relativePath.charAt(0) !== '.'){
      relativePath = './' + relativePath;
    }
    importAry.push(`import ${fileName} from '${relativePath}';`);
    return fileName;
  });
  const content = `${importAry.join('')} export default [${modelNameAry.join(',')}];`;
  fs.writeFileSync(modelOutputPath,content);
  console.log(`成功生成 model ：${modelOutputPath} 用时：${+new Date() - time}ms`);
}

function babelContent(content,cb){
  require('@babel/core').transform(content,getJsRule().use[0].options,(err,result) => {
    if(err){
      console.log(err);
    }else{
      cb(result.code);
    }
  });
}

function updateRouter(){
  const time = +new Date();
  console.log('开始生成 router');
  Object.keys(require.cache).forEach(key => {
    if(key.includes(configDirname)){
      delete require.cache[key];
    }
  });
  const config = require(resolve(configDirname,'config'));
  const configOutputPath = path.join(configOutputDirname,'config.js');
  const routerOutputPath = path.join(configOutputDirname,'routes.js');
  fs.writeFileSync(configOutputPath,'export default ' + JSON.stringify(config));
  console.log(`成功生成 config ：${configOutputPath} 用时：${+new Date() - time}ms`);

  const content = getRouterContent({
    ...config,
    output:routerOutputPath,
  });
  fs.writeFileSync(routerOutputPath,content);
  console.log(`成功生成 model ：${routerOutputPath} 用时：${+new Date() - time}ms`);
}


function getRouterContent(option){
  const {routes = [],output,isRoot = true,importList = []} = option;
  const filterFields = ['component','children'];
  const valueContent = routes.map(item => {
    const valueContent = Object.keys(item).map(key => {
      let value = item[key];
      if(key === 'component'){
        const relativePath = path.relative(path.dirname(output),resolve(pageDirname,value)).replace(/\\/g,'/');
        let {dynamic = option.dynamicImport} = item;
        if(dynamic){
          importList.push(`import Async from 'wangct-react/lib/Async';\n`);
          value = `(props) => <Async {...props} getComponent={() => import('${relativePath}')} />`;
        }else{
          value = 'c_' + util.random();
          importList.push(`import ${value} from '${relativePath}';\n`);
        }
      }else if(key === 'children'){
        value = getRouterContent({
          ...option,
          routes:value,
          isRoot:false,
          importList
        })
      }
      return `${key}:${util.isString(value) && !filterFields.includes(key) ? `'${value}'` : value.toString()}`;
    }).join(',\n');
    return `{${valueContent}}`
  }).join(',\n');
  const content = `[${valueContent}]`;
  return isRoot ? `import React from 'react';${arrayUtil.noRepeat(importList).join('')}export default ${content}` : content;
}


function updateComponent(){
  console.log('开始生成 components/index.js');
  const time = +new Date();
  const output = resolve(tempDirname,'components/config.js');
  util.mkdir(output);
  new Babel({
    src:componentConfigPath,
    output,
    success(){
      delete require.cache[output];
      const config = require(output).default;
      const {components = []} = config;
      let importAry = [];
      let modelNameAry = components.map(item => {
        let filePath = resolve(componentConfigPath,'..',item);
        let relativePath = path.relative(path.resolve(componentOutput,'..'),filePath).replace(/\\/g,'/');
        if(relativePath.charAt(0) !== '.'){
          relativePath = './' + relativePath;
        }
        importAry.push(`import ${item} from '${relativePath}';`);
        return item;
      });
      let content = `${importAry.join('')} export {${modelNameAry.join(',')}};`;
      fs.writeFileSync(componentOutput,content);
      console.log(`成功生成 components/index.js ：${componentOutput} 用时：${+new Date() - time}ms`);
    }
  });
}

process.on('uncaughtException',err => {
  console.log(err);
});