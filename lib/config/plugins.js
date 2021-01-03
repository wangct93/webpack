
const config = require('./config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getListByMap} = require("../utils/utils");
const {isDevEnv} = require("../utils/utils");
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isStr = require("@wangct/util/lib/typeUtil").isStr;
const isBol = require("@wangct/util/lib/typeUtil").isBol;

const {objectUtil,isBoolean,resolve,toAry} = require("@wangct/node-util");

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
    miniCss(miniCss){
      if(isBol(miniCss)){
        miniCss = {
          filename:'[name].css',
        };
      }else if(isStr(miniCss)){
        miniCss = {
          filename:miniCss,
        };
      }
      return new MiniCssExtractPlugin(miniCss);
    }
  };
  return getListByMap(mapData,config);
}
