
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const resolveDva = (...paths) => path.resolve(__dirname,'../..',...paths);

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
      {
        test: /\.jsx?$/,
        use: [
          {
            loader:'babel-loader',
            options:{
              presets: ['@babel/preset-react','@babel/preset-env',...(defineConfig.extraBabelPresets || [])],
              plugins:[
                '@babel/plugin-transform-runtime',
                ['import', {
                  libraryName: 'antd',
                  style: true
                },'ant'],
                ['import',{
                  libraryName:'wangct-react',
                  customName(name){
                    return `wangct-react/lib/${name}`
                  }
                },'wct'],
                ['@babel/plugin-proposal-decorators',{legacy:true}],
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-export-default-from',
                ...(defineConfig.extraBabelPlugins || [])
              ]
            }
          }
        ],
        exclude:resolve('node_modules')
      },
      {
        test: /\.(ts|js)x?$/,
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