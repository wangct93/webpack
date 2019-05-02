

const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const baseConfig = require('./base');

module.exports = {
  mode:'development',
  entry:baseConfig.entry,
  output:{
    filename:'[name].js',
    publicPath: '/'
  },
  module:{
    rules:[
      ...baseConfig.module.rules,
      {
        test:/\.(less|css)$/,
        use:['style-loader',{
          loader:'css-loader',
          options:{
            importLoaders:1,
            modules:true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },'less-loader']
      }
    ]
  },
  plugins:[
    ...baseConfig.plugins
  ],
  devServer:{
    contentBase:resolve('public'),
    port:3030,
    hot:true
  }
};