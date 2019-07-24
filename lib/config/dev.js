

const baseConfig = require('./base');
const webpack = require('webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const {getWebpackConfig} = require('./util');
const config = require('./config');
const {extraWebpackConfig} = config;

const {getRules} = require('./rules');


module.exports = getWebpackConfig({
  ...baseConfig,
  output:{
    ...baseConfig.output,
    ...config.output.dev
  },
  mode:'development',
  devtool:'cheap-module-eval-source-map',
  module:{
    rules:getRules()
  },
  plugins:[
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new ErrorOverlayPlugin(),
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
