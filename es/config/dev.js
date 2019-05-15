

const baseConfig = require('./base');
const webpack = require('webpack');
const defineConfig = require('./defineConfig');
const {getCssRules,getFileRule} = require('./util');
module.exports = {
  ...baseConfig,
  mode:'development',
  devtool:baseConfig.devtool || 'cheap-module-eval-source-map',
  module:{
    rules:[
      ...baseConfig.module.rules,
      ...getCssRules(),
      getFileRule()
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