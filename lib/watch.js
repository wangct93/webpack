/**
 * Created by wangct on 2018/8/28.
 */

const fs = require('fs');
const path = require('path');
const util = require('@wangct/node-util');
const {aryRemoveRepeat,resolve,callFunc} = util;

const paths = require('./config/paths');
const {copyFile,toStr} = util;
const {resolveLib} = require("./utils/utils");
const {babelOptions} = require("./utils/options");

const {modelDir,pageDir,configOutput:configOutputDir,componentDir} = paths;
const configPath = resolve(paths.configPath);

const options = [
  {
    src:modelDir,
    callback:updateModel
  },
  // {
  //   src:path.dirname(configPath),
  //   callback:updateRouter
  // },
  {
    src:componentDir,
    callback:updateComponent
  }
];

exports.once = once;
exports.start = start;

async function once(){
  await initAssets();
  const promises = options.map(opt => {
    return callFunc(opt.callback);
  });
  await Promise.all(promises);
}


async function start(){
  await initAssets();
  options.forEach(opt => {
    util.watch(opt.src,opt.callback);
    callFunc(opt.callback);
  });
}

async function initAssets(){
  console.log('开始初始化资源：');
  await copyFile(resolveLib('template/frame'),resolve('src/frame'),{});
  console.log('拷贝成功');
}

function getModelsOutputPath(){
  const {modalsOutputPath} = paths;
  if(modalsOutputPath){
    return modalsOutputPath;
  }
  return resolve(paths.configOutput,'models.js');
}

async function updateModel(){
  const time = +new Date();
  console.log('开始生成 model');
  const modelOutputPath = getModelsOutputPath();
  util.mkdir(path.dirname(modelOutputPath));
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

  await babelContent(content,modelOutputPath).then(content => {
    fs.writeFileSync(modelOutputPath,content);
    console.log(`成功生成 model ：${modelOutputPath} 用时：${+new Date() - time}ms`);
  });
}

async function updateRouter(){
  const time = +new Date();
  console.log('开始生成 router');
  const configDir = path.dirname(configPath);
  const fileList = fs.readdirSync(configDir).map(item => resolve(configDir,item));
  fileList.forEach(filePath => delete require.cache[filePath]);

  const config = require(configPath);
  const configOutputPath = resolve(configOutputDir,'config.js');
  const configContent = 'export default ' + JSON.stringify(config);
  await babelContent(configContent,configOutputPath).then(content => {
    fs.writeFileSync(configOutputPath,content);
    console.log(`成功生成 config ：${configOutputPath} 用时：${+new Date() - time}ms`);
  });
  const routesOutputPath = getRoutesOutputPath();
  const content = getRouterContent({
    ...config,
    output:routesOutputPath,
  });
  util.mkdir(path.dirname(routesOutputPath));
  await babelContent(content,routesOutputPath).then(content => {
    fs.writeFileSync(routesOutputPath,content);
    console.log(`成功生成 router ：${routesOutputPath} 用时：${+new Date() - time}ms`);
  });
}

function getRoutesOutputPath(){
  const {routesOutputPath} = paths;
  if(routesOutputPath){
    return routesOutputPath;
  }
  return resolve(paths.configOutput,'routes.js');
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
  return isRoot ? `import React from 'react';${aryRemoveRepeat(importList).join('')}export default ${content}` : content;
}


async function updateComponent(){
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


/**
 * 编译为es5
 * @param content
 * @param outputFilePath
 * @returns {Promise<unknown>}
 */
async function babelContent(content,outputFilePath){
  if(!toStr(outputFilePath).includes('node_modules')){
    return content;
  }
  return new Promise((cb,eb) => {
    const babel = require('@babel/core');
    babel.transform(content, babelOptions, (err, result) => {
      if (err) {
        eb(err);
      } else {
        cb(result.code);
      }
    });
  })
}
