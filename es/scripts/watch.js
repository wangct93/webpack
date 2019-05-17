/**
 * Created by wangct on 2018/8/28.
 */

const fs = require('fs');
const path = require('path');
const Babel = require('wangct-babel');
const util = require('wangct-server-util');
const {getJsRule,resolveRoot,resolve} = require('../config/util');
const {arrayUtil} = util;

const defineConfig = require('../config/defineConfig');

const {isSelf} = defineConfig;
const libDirname = isSelf ? 'es' : 'lib';

const modelDirname = resolveRoot('src/models');
const configDirname = resolveRoot('config');
const pageDirname = defineConfig.pageDirname || resolveRoot('src/pages');
const componentConfigPath = resolveRoot('src/components/config.js');


const modelOutputPath = resolve(libDirname,'src/config/models.js');
const routerOutputPath = resolve(libDirname,'src/config/routes.js');
const componentOutput = resolveRoot('src/components/index.js');
const tempDirname = resolve('temp');



util.mkdir(modelOutputPath);
util.mkdir(routerOutputPath);
util.mkdir(componentOutput);
util.mkdir(tempDirname);

const options = [
  {
    src:modelDirname,
    callback:updateModel,
    error(){
      fs.writeFileSync(modelOutputPath,`export default []`);
    }
  },
  {
    src:configDirname,
    callback:updateRouter,
    error(){
      fs.writeFileSync(routerOutputPath,`export default []`);
      fs.writeFileSync(resolve(routerOutputPath,'../config.js'),'export default {}');
    }
  },
  {
    src:componentConfigPath,
    callback:updateComponent
  }
];


options.forEach(opt => {
  fs.stat(opt.src,(err) => {
    if(err){
      util.callFunc(opt.error);
    }else{
      util.watch(opt);
    }
  });
});



function updateModel(){
  const time = +new Date();
  console.log('开始生成 model');
  fs.readdir(modelDirname,(err,data) => {
    if(err){
      console.log(err);
    }else{
      let importAry = [];
      let modelNameAry = data.map(item => {
        let filePath = resolve(modelDirname,item);
        let relativePath = path.relative(path.resolve(modelOutputPath,'..'),filePath).replace(/\\/g,'/');
        let fileName = path.basename(item,path.extname(item)) + '_' + +new Date();
        if(relativePath.charAt(0) !== '.'){
          relativePath = './' + relativePath;
        }
        importAry.push(`import ${fileName} from '${relativePath}';`);
        return fileName;
      });
      let content = `${importAry.join('')} export default [${modelNameAry.join(',')}];`;
      util.mkdir(modelOutputPath);

      if(isSelf){
        fs.writeFile(modelOutputPath,content,function(err){
          if(err){
            console.log(err);
          }else{
            console.log(`成功生成 model ：${modelOutputPath} 用时：${+new Date() - time}ms`);
          }
        });
      }else{
        babelContent(content,(code) => {
          fs.writeFile(modelOutputPath,code,function(err){
            if(err){
              console.log(err);
            }else{
              console.log(`成功生成 model ：${modelOutputPath} 用时：${+new Date() - time}ms`);
            }
          });
        })
      }

    }
  })
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
  const content = getRouterContent({
    ...config,
    output:routerOutputPath,
  });
  util.mkdir(routerOutputPath);
  const configOutputPath = resolve(routerOutputPath,'..','config.js');
  if(isSelf){
    fs.writeFile(routerOutputPath,content,(err) => {
      if(err){
        console.log(err);
      }else{
        console.log(`成功生成 router ：${routerOutputPath} 用时：${+new Date() - time}ms`);
      }
    });
    fs.writeFile(configOutputPath,'export default ' + JSON.stringify(config),(err) => {
      if(err){
        console.log(err);
      }else{
        console.log(`成功生成 config ：${configOutputPath} 用时：${+new Date() - time}ms`);
      }
    })
  }else{
    babelContent(content,(code) => {
      fs.writeFile(routerOutputPath,code,function(err){
        if(err){
          console.log(err);
        }else{
          console.log(`成功生成 model ：${routerOutputPath} 用时：${+new Date() - time}ms`);
        }
      });
    })
    babelContent('export default ' + JSON.stringify(config),(code) => {
      fs.writeFile(configOutputPath,code,function(err){
        if(err){
          console.log(err);
        }else{
          console.log(`成功生成 model ：${configOutputPath} 用时：${+new Date() - time}ms`);
        }
      });
    })
  }
}


function getRouterContent(option){
  const {routes = [],output,isRoot = true,importList = []} = option;
  const filterFields = ['component','children'];
  const valueContent = routes.map(item => {
    const valueContent = Object.keys(item).map(key => {
      let value = item[key];
      if(key === 'component'){
        const relativePath = path.relative(path.dirname(output),resolve(pageDirname,value,value)).replace(/\\/g,'/');
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
      Object.keys(require.cache).forEach(key => {
        if(key.includes(output)){
          delete require.cache[key];
        }
      });
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
      fs.writeFile(componentOutput,content,function(err){
        if(err){
          console.log(err);
        }else{
          console.log(`成功生成 components/index.js ：${componentOutput} 用时：${+new Date() - time}ms`);
          if(typeof cb === 'function'){
            cb();
          }
        }
      });
    }
  });
}

process.on('uncaughtException',err => {
  console.log(err);
});
process.on('unhandledRejection',(err,promise) => {
  console.log('error:',err);
});