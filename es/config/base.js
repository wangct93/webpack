
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const resolveDva = (...paths) => path.resolve(__dirname,'../..',...paths);
const {getJsRule} = require('./util');
const defineConfig = require('./defineConfig');

const indexPath = resolveDva(defineConfig.isSelf ? 'es' : 'lib','src/index');


module.exports = {
  entry:{
    index:[indexPath].concat(defineConfig.entry).filter(item => !!item)
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
        exclude:resolve('node_modules')
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