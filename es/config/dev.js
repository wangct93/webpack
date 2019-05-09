

const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const baseConfig = require('./base');
const webpack = require('webpack');
const defineConfig = require('./defineConfig');


module.exports = {
  mode:'development',
  entry:baseConfig.entry,
  output:{
    filename:'[name].js',
    publicPath: '/'
  },
  devtool:'cheap-module-eval-source-map',
  module:{
    rules:[
      ...baseConfig.module.rules,
      ...baseConfig.lessRules
    ]
  },
  plugins:[
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    ...(defineConfig.plugins || [])
  ],
  devServer:{
    contentBase:resolve('public'),
    port:8888,
    hot:true,
    historyApiFallback: true,
    proxy:defineConfig.proxy,
    ...defineConfig.devServer
    // host:'0.0.0.0',
    // open:true
  }
};