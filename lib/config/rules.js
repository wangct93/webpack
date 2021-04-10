const {getListByMap} = require("../utils/utils");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {resolve,toAry} = require("@wangct/node-util");
const config = require("./config");
const {resolveLib} = require("../utils/utils");
const {isBol} = require("@wangct/util/lib/typeUtil");
const {babelOptions} = require("../utils/options");
const {isDevEnv} = require("../utils/utils");

module.exports = getRules();

function getRules(){
  return [
    getJsRule(),
    getAntdCssRule(),
    getCssRule(),
    getFileRule(),
    ...toAry(getLessRules()),
    ...toAry(config.extraRules),
  ]
}

function getJsRule(options = config){
  const subOptions = babelOptions;
  const {useLibLoader = true} = options;
  const rule = {
    test: /\.(ts|js)x?$/i,
    use: [{
      loader: 'babel-loader',
      options: {
        presets: [...subOptions.presets,...toAry(options.extraBabelPresets)],
        plugins:[
          ...subOptions.plugins,
          ...getBabelPlugins(options),
          ...toAry(options.extraBabelPlugins),
        ],
      },
    }],
    exclude:/node_modules/,
  };
  if(useLibLoader){
    rule.use.push(resolveLib('loaders/react-lib'));
  }
  return rule;
}

/**
 * 获取babel额外配置插件
 * @param options
 * @returns {*[]}
 */
function getBabelPlugins(options){
  const mapData = {
    typescript:['@babel/plugin-transform-typescript', {
      isTSX: true,
      allExtensions: true
    }],
    antdImport:['import', {
      libraryName: 'antd',
      libraryDirectory:'es',
      style: 'css', // todo 使用less报错
    },'ant'],
  };
  return getListByMap(mapData,options);
}

/**
 * 获取文件规则
 * @param options
 * @returns {{test: RegExp, loader: string, options: {outputPath: string, limit: *, name: *, publicPath: string}}}
 */
function getFileRule(options = config){
  const paths = require('./paths');
  return {
    test: /\.(png|jpg|jpng|eot|ttf|temp)$/i,
    loader: 'url-loader',
    options:{
      limit:options.urlLoaderLimit,
      name:options.urlLoaderName,
      publicPath:paths.urlLoaderPublicPath,
      outputPath:paths.urlLoaderOutputPath,  //todo:不能输入系统盘开头地址
    },
  };
}

/**
 * antd样式加载
 * @returns {{include: *, test: RegExp, use: *}}
 */
function getAntdCssRule(options = config){
  const {modifyVars,antdModifyVars = modifyVars} = options;
  const cssLoaderUse = [
    getCssLoader(),
    {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true,
        modifyVars:antdModifyVars,
      },
    },
  ];
  return {
    test: /\.(less|css)$/i,
    use: getCssUse(cssLoaderUse),
    include: resolve('node_modules/antd'),
  };
}

function getCssUse(cssUse){
  const firstLoader = isDevEnv() || !config.miniCss ? 'style-loader' : MiniCssExtractPlugin.loader;
  return [
    firstLoader,
    ...toAry(cssUse),
  ];
}

/**
 * css样式（排除antd）
 * @returns {{test: RegExp, use: *, exclude: *}}
 */
function getCssRule(){
  return {
    test: /\.css$/i,
    use: getCssUse([getCssLoader()]),
    exclude: resolve('node_modules/antd'),
  };
}

/**
 * less样式组
 * @returns {{test: RegExp, use: *, exclude: *}[]}
 */
function getLessRules(options = config){
  const {disableCssModules} = options;
  if(disableCssModules){
    return isBol(disableCssModules) ? [
      getLessRule({
        ...options,
        disableCssModules:true,
        exclude: resolve('node_modules/antd'),
      })
    ] : [
      getLessRule({
        ...options,
        disableCssModules:true,
        include: disableCssModules,
      }),
      getLessRule({
        ...options,
        disableCssModules:false,
        exclude: [resolve('node_modules/antd'),...toAry(disableCssModules)],
      }),
    ]
  }
  return [
    getLessRule({
      ...options,
      disableCssModules:false,
      exclude: resolve('node_modules/antd'),
    })
  ];
}

/**
 * less样式
 * @returns {{test: RegExp, use: *, exclude: *}}
 */
function getLessRule(options = config){
  return {
    test: /\.less$/i,
    use: getCssUse([
      getCssLoader(options),
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true,
          modifyVars:options.modifyVars,
        }
      },
    ]),
    include:options.include,
    exclude:options.exclude,
  };
}

/**
 * 获取css加载器
 * @param options
 * @returns {{loader: string, options: {modules: {mode: string, localIdentName: (string)}}}}
 */
function getCssLoader(options = {}){
  const {disableCssModules = true} = options;
  return {
    loader: 'css-loader',
    options: {
      modules: !disableCssModules,
      localIdentName:options.cssLocalIdentName,
    }
  };
}
