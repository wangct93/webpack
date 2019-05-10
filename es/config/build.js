
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const baseConfig = require('./base');
const defineConfig = require('./defineConfig');
const {getCssRules} = require('./util');

module.exports = {
  ...baseConfig,
  mode:'production',
  output:{
    path:defineConfig.outputPath || resolve('dist'),
    filename:'[name].js',
    publicPath: defineConfig.publicPath || '/'
  },
  module:{
    rules:[
      ...baseConfig.module.rules,
      ...getCssRules({build:true})
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