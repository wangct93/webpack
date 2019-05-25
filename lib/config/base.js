
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getJsRule} = require('./util');
const defineConfig = require('./defineConfig');
const util = require('wangct-server-util');
const {resolve:resolveRoot} = util;



module.exports = {
  entry:{
    ...defineConfig.entry,
    index:resolveRoot('src/_entry/index')
  },
  output:{
    path:defineConfig.outputPath || resolveRoot('dist'),
    filename:'[name].js',
    publicPath:'/',
    ...defineConfig.output
  },
  externals:defineConfig.externals,
  resolve:{
    extensions:['.js','jsx','.ts','.tsx'],
    alias:{
      '@':resolveRoot('src'),
      '@lib':resolveRoot('src/components')
    },
    ...defineConfig.resolve
  },
  devtool:defineConfig.devtool,
  module:{
    rules:[
      getJsRule(),
      ...getRules(),
      ...(defineConfig.rules || [])
    ]
  },
  plugins:[
    new HtmlWebpackPlugin(defineConfig.html || {
      template:resolveRoot('src/_entry/public/index.html')
    })
  ]
};

function getRules(){
  const rules = [];
  if(defineConfig.eslint){
    rules.push({
      test: /\.jsx?$/,
      enforce:'pre',
      use:'eslint-loader',
      exclude:resolveRoot('node_modules')
    });
  }
  return rules
}