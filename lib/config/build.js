
const {getLessRule} = require("./common");
const {getCssRule} = require("./common");
const {getAntdCssRule} = require("./common");
const {getJsRule} = require("./common");
const {getFileRule} = require("./common");
const {config} = require("./config");
const {getPlugins} = require("./common");
const paths = require('./paths');
const {resolve,toAry} = require('wangct-server-util');

module.exports = {
  mode:'production',       // production 生产模式
  entry: paths.entry,
  output:{
    publicPath: paths.outputPublicPath,
    path:paths.outputPath,
    filename: config.outputFilename,
  },
  resolve:{
    extensions:['.js','jsx','.ts','.tsx'],
    alias:{
      '@':resolve('src'),
      '@lib':resolve('src/components'),
      ...config.alias,
    },
  },
  module:{
    rules:[
      getJsRule(),
      getCssRule(),
      getLessRule(),
      getFileRule(),
      getAntdCssRule(),
      ...toAry(config.extraRules),
    ],
  },
  plugins: [
    ...getPlugins({
      hot:true,
      progress:true,
      clean:true,
      html:paths.html,
      extractCss:config.extractCss,
    }),
    ...toAry(config.extraPlugins),
  ],
};



