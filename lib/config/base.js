
const config = require("./config");
const rules = require('./rules');
const plugins = require('./plugins');
const paths = require('./paths');

const {resolve,aryToObject,isNum,toAry} = require('wangct-server-util');

module.exports = {
  entry: config.entry,
  devtool:config.devtool,
  output:{
    publicPath: paths.outputPublicPath,
    path:paths.outputPath,
    filename: config.outputFilename,
  },
  resolve:{
    extensions:['.js','jsx','.ts','.tsx',...toAry(config.extensions)],
    alias:{
      '@':resolve('src'),
      '@lib':resolve('src/components'),
      ...config.alias,
    },
  },
  module:{
    rules,
  },
  plugins,
};
