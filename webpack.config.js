
const webpack = require('webpack');
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

  mode:'development',
  entry:{
    index:resolve('src/index')
  },
  output:{
    path:resolve('dist'),
    filename:'[name].js',
    publicPath: '/'
  },
  module:{
    rules:[
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader:'babel-loader',
            options:{
              presets: ['@babel/preset-typescript','@babel/preset-react','@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/
      },
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
      },
      {
        test:/\.(gif|jpg|jpeg|png|svg)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'static/[name]_[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:resolve('public/index.html')
    }),
    new ExtractTextWebpackPlugin('index.css'),
    new CleanWebpackPlugin({
      verbose:true
    })
  ],
  devServer:{
    contentBase:resolve('public'),
    port:3030,
    hot:true
  }
};