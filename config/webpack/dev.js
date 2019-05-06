

const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const baseConfig = require('./base');
const webpack = require('webpack');

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
    new webpack.HotModuleReplacementPlugin({

    })
  ],
  devServer:{
    contentBase:resolve('public'),
    port:3030,
    hot:true
  }
};