const {resolve} = require("node-util-1");

const defaultConfig = {
  port:8888,
  entry:{
    index:resolve('src'),
  },
  html:resolve(__dirname,'../html/index.html'),
  cssLocalIdentName:'[path][name]__[local]--[hash:base64:5]',
  urlLoaderLimit:8192,
  urlLoaderName:'[name]_[hash:8].[ext]',
  outputFilename:'[name].js',
  devtool:'cheap-module-eval-source-map',
  antdImport:true,
  progress:true,
  mode:'development',
  dev:{
    hot:true,
  },
  prod:{
    outputFilename:'[name]_[hash:8].js',
    extractCss:'[name]_[hash:8].css',
    clean:true,
    cssLocalIdentName:'[local]--[hash:base64:5]',
    mode:'production',
  },
};

const defineConfig = catchError(() => {
  return require(resolve('config/config'));
},{});

module.exports = getConfig();

function getConfig(){
  const env = process.env.env;
  const config = {
    ...defaultConfig,
    ...defaultConfig[env],
  };
  const extraConfig = {
    ...defineConfig,
    ...defineConfig[env],
  };
  return {
    ...config,
    ...extraConfig,
  };
}


function catchError(func,value){
  try{
    value = func();
  }catch(e){
    console.log('该异常不影响后续代码执行',e);
  }
  return value;
}



