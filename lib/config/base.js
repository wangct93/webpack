
const config = require("./config");
const rules = require('./rules');
const plugins = require('./plugins');
const paths = require('./paths');

const {resolve,aryToObject,isNum,toAry} = require('node-util-1');

module.exports = {
  entry: config.entry,
  devtool:config.devtool,
  output:{
    publicPath: paths.outputPublicPath,
    path:paths.outputPath,
    filename: config.outputFilename,
  },
  mode:config.mode,
  resolve:{
    extensions:['.js','jsx','.ts','.tsx',...toAry(config.extensions)],
    alias:{
      '@':resolve('src'),
      '@lib':resolve('src/components'),
      ...config.alias,
    },
  },
  externals:config.externals,
  module:{
    rules,
  },
  plugins,
  optimization:{
    splitChunks:{
      chunks: 'all',
      cacheGroups: {
        "react-vendor": {
          test: (module) => (/react/.test(module.context) || /redux/.test(module.context)
            || /classnames/.test(module.context) || /prop-types/.test(module.context)),
          priority: 3,
          reuseExistingChunk: false
        },
        "antd-vendor": {
          // || /[\\/]node_modules[\\/]/.test(module.context)
          test: (module) => (/antd/.test(module.context)),
          priority: 2,
          reuseExistingChunk: false
        },

      }
    }
  }
};
