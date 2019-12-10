const webpack = require('webpack'); //webpack对象

const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');  //进度条插件

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const {objectUtil,isBoolean,resolve,toAry} = require("wangct-server-util");

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const paths = require('./paths');
const {isDevEnv} = require("./util");
const {getConfig} = require("./config");


module.exports = {
  getPlugins,
  getJsRule,
  getFileRule,
  getAntdCssRule,
  getCssRule,
  getLessRule,
};

function getJsRule(options = getConfig()){

  return {
    test: /\.(ts|js)x?$/i,
    use: [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react','@babel/preset-env',...toAry(options.extraBabelPresets)],
        plugins:[
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-transform-runtime',
          ['@babel/plugin-proposal-decorators',{legacy:true}],
          ['@babel/plugin-proposal-class-properties',{loose:true}],
          '@babel/plugin-proposal-export-namespace-from',
          '@babel/plugin-proposal-export-default-from',
          ...getBabelPlugins(options),
          ...toAry(options.extraBabelPlugins),
        ],
      },
    }],
    exclude:/node_modules/,
  }
}

function getBabelPlugins(options){
  const mapData = {
    typescript:() => ['@babel/plugin-transform-typescript', {
      isTSX: true,
      allExtensions: true
    }],
    antdImport:() => ['import', {
      libraryName: 'antd',
      libraryDirectory:'es',
      style: true,
    },'ant'],
  };
  return getListByMap(mapData,options);
}

function getListByMap(mapData = {},options){
  options = options || objectUtil.map(mapData,() => true);
  const plugins = [];
  Object.keys(mapData).forEach((key) => {
    if(options[key]){
      plugins.push(mapData[key]());
    }
  });
  return plugins;
}

function getPlugins(options = getConfig()){
  options = {
    extractCss:!isDevEnv(),
    ...options,
  };

  const mapData = {
    hot:() => new webpack.HotModuleReplacementPlugin(),
    html:() => {
      const filePath = isBoolean(options.html) ? paths.html : options.html;
      return new HtmlWebpackPlugin({
        template:resolve(filePath),
      });
    },
    clean:() => new CleanWebpackPlugin({
      verbose:true,
    }),
    progress:() => new ProgressBarWebpackPlugin(),
    extractCss:() => {
      const filename = isBoolean(options.extractCss) ? 'index.css' : options.extractCss;
      return new ExtractTextPlugin(filename);
    }
  };
  return getListByMap(mapData,options);
}

function getFileRule(options = getConfig()){
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

//antd样式加载
function getAntdCssRule(){
  const cssLoaderUse = [
    'css-loader',
    {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true,
        modifyVars:getAntdTheme(),
      },
    },
  ];
  return {
    test: /\.(less|css)$/i,
    use: getCssUse(cssLoaderUse),
    include: resolve('node_modules/antd'),
  };
}

function getAntdTheme(){
  return getConfig().antdTheme || {};
}

function getCssUse(cssUse){
  const isDev = isDevEnv();
  return isDev || !getConfig().extractCss ? ['style-loader',...cssUse] : ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: cssUse
  });
}

//css规则（排除antd）
function getCssRule(){
  return {
    test: /\.css$/i,
    use: getCssUse(['css-loader']),
    exclude: resolve('node_modules/antd'),
  };
}

function getLessRule(){
  return {
    test: /\.less$/i,
    use: getCssUse([
      {
        loader: 'css-loader',
        options: {
          modules: true,
        }
      },
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true,
          modifyVars:getTheme(),
        }
      },
    ]),
    exclude: resolve('node_modules/antd'),
  };
}

function getTheme(){
  return getConfig().theme || {};
}
