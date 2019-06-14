

const baseConfig = require('./base');
const webpack = require('webpack');
const {extraWebpackConfig,getWebpackConfig} = require('./util');
const config = require('./config');

const rules = require('./rules');


module.exports = getWebpackConfig({
  ...baseConfig,
  mode:'development',
  module:{
    rules:rules()
  },
  plugins:[
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    ...(extraWebpackConfig.plugins || [])
  ],
  devServer:{
    contentBase:'/',
    port:config.port || 8888,
    hot:true,
    historyApiFallback: true,
    host:'0.0.0.0',
    useLocalIp:true,
    open:true,
    ...extraWebpackConfig.devServer,
    proxy:config.proxy,

  }
});