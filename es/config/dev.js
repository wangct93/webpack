

const baseConfig = require('./base');
const webpack = require('webpack');
const defineConfig = require('./defineConfig');
const {getCssRules,getFileRule,extraWebpackConfig} = require('./util');
module.exports = extraWebpackConfig({
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
    open:true,
    ...defineConfig.devServer
  }
});