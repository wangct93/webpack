/**
 * Created by wangct on 2018/8/28.
 */

const fs = require('fs');
const path = require('path');
const util = require('wangct-server-util');
const {arrayUtil} = util;

const config = require('./config/config');
const {resolve} = util;

const modelDirname = resolve(config.modelDir);
const configPath =  resolve(config.configPath)
const configDirname = path.dirname(configPath);
const pageDirname = resolve(config.pageDir);
const componentConfigPath = resolve(config.componentConfigPath);


const configOutputDirname = resolve(config.configOutputDir);


util.mkdir(configOutputDirname);

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

function updateRouter(){
  const time = +new Date();
  console.log('开始生成 router');
  Object.keys(require.cache).forEach(key => {
    if(key.includes(configDirname)){
      delete require.cache[key];
    }
  });
  const config = require(configPath);
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
          importList.push(`import Async from '../components/Async';\n`);
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

  delete require.cache[componentConfigPath];
  const config = require(componentConfigPath);
  const {components = []} = config;
  const componentOutput = path.join(path.dirname(componentConfigPath),'index.js');
  let importAry = [];
  let modelNameAry = components.map(item => {
    importAry.push(`import ${item} from './${item}';`);
    return item;
  });
  let content = `${importAry.join('')} export {${modelNameAry.join(',')}};`;
  fs.writeFileSync(componentOutput,content);
  console.log(`成功生成 components/index.js ：${componentOutput} 用时：${+new Date() - time}ms`);
}

process.on('uncaughtException',err => {
  console.log(err);
});