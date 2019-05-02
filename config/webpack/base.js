
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);

module.exports = {
  entry:{
    index:resolve('src/index')
  },
  module:{
    rules:[
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader:'babel-loader',
            options:{
              presets: ['@babel/preset-typescript','@babel/preset-react','@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/
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
      template:resolve('public/index.html')
    })
  ]
};