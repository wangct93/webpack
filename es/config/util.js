const util = require('wangct-server-util');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const {objectUtil} = util;
const defineConfig = require('./defineConfig');
const resolve = (...paths) => path.resolve(__dirname,'../..',...paths);
const resolveRoot = (...paths) => path.resolve(process.cwd(),...paths);

module.exports = {
  getCssRules,
  resolve,
  resolveRoot,
  getJsRule
};

function getCssRules(opt){
  const {disableCssModules} = defineConfig;

  if(disableCssModules === true){
    return [getCssRule({
      ...opt,
      disableCssModules:true
    }),getCssRule({
      ...opt,
      disableCssModules:true,
      isLess:false
    })]
  }else{
    let noCssModulePaths = [resolveRoot('node_modules/antd')];
    if(util.isArray(disableCssModules)){
      noCssModulePaths = noCssModulePaths.concat(disableCssModules);
    }
    return [
      getCssRule({
        ...opt,
        exclude:noCssModulePaths
      }),
      getCssRule({
        ...opt,
        disableCssModules:true,
        include:noCssModulePaths
      }),
      getCssRule({
        ...opt,
        exclude:noCssModulePaths,
        isLess:false
      }),
      getCssRule({
        ...opt,
        disableCssModules:true,
        include:noCssModulePaths,
        isLess:false
      })
    ]
  }
}


function getCssRule(opt){
  const {build,disableCssModules,isLess = true} = opt;
  const cssLoader = disableCssModules ? 'css-loader' : {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: true,
      localIdentName: '[name]__[local]___[hash:base64:5]'
    }
  };
  const lessLoader = {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true
    }
  };
  const sassLoader = 'sass-loader';
  const use = [cssLoader];
  if(isLess){
    use.push(lessLoader);
  }else{
    use.push(sassLoader);
  }

  return {
    test:isLess ? /\.(css|less)$/ : /\.scss$/,
    use:build ? ExtractTextWebpackPlugin.extract({
      fallback:'style-loader',
      use:use
    }) : ['style-loader',...use],
    ...objectUtil.clone(opt,['include','exclude'])
  };
}


function getJsRule(){
  const plugins = [
    '@babel/plugin-transform-runtime',
    ['import', {
      libraryName: 'antd',
      style: true
    },'ant'],
    ['@babel/plugin-proposal-decorators',{legacy:true}],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    ...(defineConfig.extraBabelPlugins || [])
  ];
  if(defineConfig.typescript){
    plugins.unshift(['@babel/plugin-transform-typescript', {
      isTSX: true,
      allExtensions: true
    }])
  }

  return {
    test: /\.(js|ts)x?$/,
    use: [
      {
        loader:'babel-loader',
        options:{
          presets: ['@babel/preset-react','@babel/preset-env',...(defineConfig.extraBabelPresets || [])],
          plugins
        }
      }
    ],
    exclude:resolveRoot('node_modules')
  };
}