
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./base');

module.exports = {
  mode:'production',
  entry:baseConfig.entry,
  output:{
    path:resolve('dist'),
    filename:'[name].js',
    publicPath: '/'
  },
  module:{
    rules:[
      ...baseConfig.module.rules,
      {
        test:/\.(less|css)$/,
        use:ExtractTextWebpackPlugin.extract({
          fallback:'style-loader',
          use:[{
            loader:'css-loader',
            options:{
              importLoaders:1,
              modules:true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },'less-loader']
        })
      }
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