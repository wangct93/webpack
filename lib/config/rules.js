
const util = require('wangct-server-util');
const config = require('./config');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const {resolve,objectUtil,arrayUtil} = util;
const {extraWebpackConfig} = require('./util');
module.exports = rules;

function rules(build){

  const rules = [
    getJsRule(),
    getEslintRule(),
    getFileRule(build),
    ...getCssRules(build),
    ...(extraWebpackConfig.rules || [])
  ];
  return rules.filter(item => !!item);
}

function getCssRules(build){
  const {disableCssModules} = config;

  if(disableCssModules === true){
    return [
      getCssRule({
        disableCssModules:true,
        build
      })
    ]
  }else{
    const noCssModulePaths = arrayUtil.toArray(disableCssModules).filter(item => item).concat(resolve('node_modules/antd'));
    return [
      getCssRule({
        build,
        exclude:noCssModulePaths
      }),
      getCssRule({
        build,
        disableCssModules:true,
        include:noCssModulePaths
      }),
    ]
  }
}


function getCssRule(opt){
  const {disableCssModules,build} = opt;
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
  const use = [cssLoader,lessLoader];

  return {
    test:/\.(css|less)$/,
    use:build ? ExtractTextWebpackPlugin.extract({
      fallback:'style-loader',
      use:use
    }) : ['style-loader',...use],
    ...objectUtil.clone(opt,['include','exclude'])
  };
}


function getJsRule(){
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    ['import', {
      libraryName: 'antd',
      style: true
    },'ant'],
    ['@babel/plugin-proposal-decorators',{legacy:true}],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    ...(config.extraBabelPlugins || [])
  ];
  if(config.typescript){
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
          presets: ['@babel/preset-react','@babel/preset-env',...(config.extraBabelPresets || [])],
          plugins
        }
      }
    ],
    exclude:resolve('node_modules')
  };
}

function getEslintRule(){
  return config.eslint && {
    test: /\.jsx?$/,
    enforce:'pre',
    use:'eslint-loader',
    exclude:resolve('node_modules')
  }
}

function getFileRule(build){
  return {
    test:/\.(gif|jpg|jpeg|png|svg)$/,
    use:[
      {
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'static/[name]_[hash].[ext]',
          publicPath:build ? config.assetsPublicPath || '/static' : '/'
        }
      }
    ]
  }
}

