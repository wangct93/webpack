

const baseConfig = require('./base');
const webpack = require('webpack');
const defineConfig = require('./defineConfig');
const {getCssRules} = require('./util');
module.exports = {
  ...baseConfig,
  mode:'development',
  output:{
    filename:'[name].js',
    publicPath: '/'
  },
  devtool:baseConfig.devtool || 'cheap-module-eval-source-map',
  module:{
    rules:[
      ...baseConfig.module.rules,
      ...getCssRules()
    ]
  },
  plugins:[
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    ...(defineConfig.plugins || [])
  ],
  devServer:{
    contentBase:'/',
    port:8888,
    hot:true,
    historyApiFallback: true,
    host:'0.0.0.0',
    useLocalIp:true,
    ...defineConfig.devServer

    // open:true
  }
};