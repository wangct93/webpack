
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./base');

module.exports = {
  mode:'production',
  entry:baseConfig.entry,
  // devtool:'source-map',
  output:{
    path:resolve('dist'),
    filename:'[name].js',
    publicPath: '/'
  },
  module:{
    rules:[
      ...baseConfig.module.rules,
      ...getLessRules(baseConfig.lessRules)
    ]
  },
  plugins:[
    ...baseConfig.plugins,
    new ExtractTextWebpackPlugin('index.css'),
    new CleanWebpackPlugin({
      verbose:true
    })
  ]
};


function getLessRules(rules){
  return rules.map(item => {
    const {use = []} = item;
    return {
      ...item,
      test:/\.(less|css)$/,
      use:ExtractTextWebpackPlugin.extract({
        fallback:'style-loader',
        use:use.slice(1)
      })
    }
  })
}