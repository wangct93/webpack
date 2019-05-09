
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);

const noCssModulesPaths = [
  resolve('node_modules/antd'),
  resolve('node_modules/wangct-react')
];

const defineConfig = require('./defineConfig');

const indexPath = defineConfig.isSelf ? resolve('es/src/index') : resolve(__dirname,'../src/index');

module.exports = {
  entry:{
    index:[indexPath,resolve('src/index')]
  },
  lessRules:[
    {
      test: /\.(less|css)$/,
      use: ['style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }
      ],
      exclude:noCssModulesPaths
    },
    {
      test: /\.(less|css)$/,
      use: ['style-loader', 'css-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }
      ],
      include:noCssModulesPaths
    }
  ],
  noCssModulesPaths:[
    resolve('node_modules/antd')
  ],
  module:{
    rules:[
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader:'babel-loader',
            options:{
              presets: ['@babel/preset-react','@babel/preset-env'],
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
                '@babel/plugin-proposal-class-properties'
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
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:defineConfig.html || resolve(__dirname,'../../public/index.html')
    })
  ]
};