
const {getLessRule} = require("./common");
const {getCssRule} = require("./common");
const {getAntdCssRule} = require("./common");
const {getJsRule} = require("./common");
const {getFileRule} = require("./common");
const {catchError} = require("./config");
const {config} = require("./config");
const {getPlugins} = require("./common");
const paths = require('./paths');

const {resolve,aryToObject,isNum,toAry} = require('wangct-server-util');

module.exports = {
  mode:'development',       // production 生产模式
  entry: resolve('src'),
  devtool:config.devtool,
  output:{
    publicPath: paths.outputPublicPath,
    path:paths.outputPath,
    filename: config.outputFilename,
  },
  resolve:{
    extensions:['.js','jsx','.ts','.tsx'],
    alias:{
      '@':resolve('src'),
      '@afc':resolve('test/src'),
      '@lib':resolve('src/components'),
      ...config.alias,
    },
  },
  module:{
    rules:[
      getJsRule(),
      getAntdCssRule(),
      getCssRule(),
      getLessRule(),
      getFileRule(),
      ...toAry(config.extraRules),
    ],
  },
  devServer:getDevServer(),
  plugins: [
    ...getPlugins({
      hot:true,
      progress:true,
      html:paths.html,
    }),
    ...toAry(config.extraPlugins),
  ],
};

function getDevServer(){
  return {
    port:config.port || process.env.port || 9580,
    contentBase:'/',
    hot:true,
    historyApiFallback: true,
    host:'0.0.0.0',
    useLocalIp:true,
    open:true,
    ...config.devServer,
    proxy:getProxy(config),
  }
}

function getProxy(config){
  return catchError(() => config.devServer.proxy,{})
}
