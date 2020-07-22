
const config = require("./config");
const baseWebpackConfig = require('./base');
const {webpackConfigFormat} = require("../utils/utils");

module.exports = webpackConfigFormat({
  ...baseWebpackConfig,
  devServer:{
    port:config.port,
    contentBase:'/',
    publicPath:'/',
    hot:true,
    historyApiFallback: true,
    host:'0.0.0.0',
    useLocalIp:true,
    open:true,
    ...config.devServer,
  },
});
