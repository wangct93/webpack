
const config = require('./config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getListByMap} = require("../utils/utils");
const {isDevEnv} = require("../utils/utils");
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const {objectUtil,isBoolean,resolve,toAry} = require("wangct-server-util");

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = getPlugins();

function getPlugins(){
  const mapData = {
    hot(){
      return new webpack.HotModuleReplacementPlugin();
    },
    html(html){
      return new HtmlWebpackPlugin({
        template:resolve(html),
      });
    },
    clean(){
      return new CleanWebpackPlugin({
        verbose:true,
      });
    },
    progress(){
      return new ProgressBarWebpackPlugin();
    },
    extractCss(extractCss){
      return new ExtractTextPlugin(extractCss);
    }
  };
  return getListByMap(mapData,config);
}
