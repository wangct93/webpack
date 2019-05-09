/**
 * Created by wangct on 2018/8/28.
 */

const fs = require('fs');
const path = require('path');
const resolveApp = (...dir) => path.resolve(process.cwd(),...dir);
const Babel = require('wangct-babel');
const util = require('wangct-server-util');
const {arrayUtil} = util;

const resolve = (...dir) => path.resolve(__dirname,'../..',...dir);

const defineConfig = require('../config/defineConfig');

const libDirname = defineConfig.isSelf ? 'es' : 'lib';

const modelDirname = resolveApp('src/models');
const configDirname = resolveApp('config');
const pageDirname = resolveApp('src/pages');
const componentConfigPath = resolveApp('src/components/config.js');


const modelOutputPath = resolve(libDirname,'src/config/models.js');
const routerOutputPath = resolve(libDirname,'src/config/routes.js');
const componentOutput = resolveApp('src/components/index.js');
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



function updateModel(cb){
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
      fs.writeFile(modelOutputPath,content,function(err){
        if(err){
          console.log(err);
        }else{
          console.log(`成功生成 model ：${modelOutputPath} 用时：${+new Date() - time}ms`);
          if(typeof cb === 'function'){
            cb();
          }
        }
      });
    }
  })
}

function updateRouter(cb){
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
  fs.writeFile(routerOutputPath,content,(err) => {
    if(err){
      console.log(err);
    }else{
      console.log(`成功生成 router ：${routerOutputPath} 用时：${+new Date() - time}ms`);
      util.callFunc(cb);
    }
  });

  const configOutputPath = resolve(routerOutputPath,'..','config.js');
  fs.writeFile(configOutputPath,'export default ' + JSON.stringify(config),(err) => {
    if(err){
      console.log(err);
    }else{
      console.log(`成功生成 config ：${configOutputPath} 用时：${+new Date() - time}ms`);
    }
  })


  // new Babel({
  //   src:configDirname,
  //   output,
  //   success(){
  //     Object.keys(require.cache).forEach(key => {
  //       if(key.includes(output)){
  //         delete require.cache[key];
  //       }
  //     });
  //
  //     const config = require(resolve(output,'config')).default;
  //     const content = getRouterContent({
  //       ...config,
  //       output:routerOutputPath,
  //     });
  //     util.mkdir(routerOutputPath);
  //     fs.writeFile(routerOutputPath,content,(err) => {
  //       if(err){
  //         console.log(err);
  //       }else{
  //         console.log(`成功生成 router ：${routerOutputPath} 用时：${+new Date() - time}ms`);
  //         util.callFunc(cb);
  //       }
  //     });
  //   }
  // });
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
  return isRoot ? `${arrayUtil.noRepeat(importList).join('')}export default ${content}` : content;
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