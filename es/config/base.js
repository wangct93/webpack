
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getJsRule,resolve,resolveRoot} = require('./util');
const defineConfig = require('./defineConfig');

const indexPath = resolve(defineConfig.isSelf ? 'es' : 'lib','src/entry.js');


module.exports = {
  entry:{
    index:[indexPath].concat(defineConfig.entry).filter(item => !!item)
  },
  output:{
    path:defineConfig.outputPath || resolveRoot('dist'),
    filename:'[name].js',
    publicPath: defineConfig.publicPath || '/'
  },
  externals:defineConfig.externals,
  resolve:{
    alias:defineConfig.alias,
    extensions:defineConfig.extraResolveExtensions
  },
  devtool:defineConfig.devtool,
  module:{
    rules:[
      getJsRule(),
      {
        test: /\.jsx?$/,
        enforce:'pre',
        use:'eslint-loader',
        exclude:resolveRoot('node_modules')
      },
      ...(defineConfig.rules || [])
    ]
  },
  plugins:[
    new HtmlWebpackPlugin(defineConfig.html || {
      template:resolve(__dirname,'../public/index.html')
    })
  ]
};