/**
 * Created by wangct on 2018/8/28.
 */
process.on('uncaughtException',err => {
  console.log(err);
});

const fs = require('fs');
const path = require('path');
const util = require('wangct-server-util');
const {noRepeat,resolve} = util;

const config = require('./config/config');

const {modelDir,pageDir,configOutputDir,componentDir} = config;
const configPath = resolve(config.configPath);

const options = [
  {
    src:modelDir,
    callback:updateModel
  },
  {
    src:path.dirname(configPath),
    callback:updateRouter
  },
  {
    src:componentDir,
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
    util.watch(opt.src,opt.callback);
  });
}


function updateModel(){
  const time = +new Date();
  console.log('开始生成 model');
  const configOutputDirname = resolve(config.configOutputDir);
  util.mkdir(configOutputDirname);
  const modelOutputPath = path.join(configOutputDirname,'models.js');
  const list = fs.readdirSync(modelDir);
  let importAry = [];
  let modelNameAry = list.map(item => {
    let filePath = resolve(modelDir,item);
    let relativePath = path.relative(resolve(modelOutputPath,'..'),filePath).replace(/\\/g,'/');
    let fileName = path.basename(item,path.extname(item)) + '_' + util.random();
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
  const configDir = path.dirname(configPath);
  const fileList = fs.readdirSync(configDir).map(item => resolve(configDir,item));
  fileList.forEach(filePath => delete require.cache[filePath]);

  const config = require(configPath);
  const configOutputPath = resolve(configOutputDir,'config.js');
  const routerOutputPath = resolve(configOutputDir,'routes.js');
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
        const relativePath = path.relative(path.dirname(output),resolve(pageDir,value)).replace(/\\/g,'/');
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
  return isRoot ? `import React from 'react';${noRepeat(importList).join('')}export default ${content}` : content;
}


function updateComponent(){
  console.log('开始生成 components/index.js');
  const time = +new Date();
  let list = fs.readdirSync(resolve(componentDir));
  list = list.filter(item => {
    const filePath = resolve(componentDir,item);
    return util.isDir(filePath) && util.isExist(resolve(filePath,'index.js'));
  });
  const componentOutput = resolve(componentDir,'index.js');
  const importContents = list.map(item => `import ${item} from './${item}';`);
  let content = `${importContents.join('')} export {${list.join(',')}};`;
  fs.writeFileSync(componentOutput,content);
  console.log(`成功生成 components/index.js ：${componentOutput} 用时：${+new Date() - time}ms`);
}
