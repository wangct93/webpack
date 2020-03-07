const {resolve} = require("wangct-server-util");

const defaultConfig = {
  port:8888,
  entry:{
    index:resolve('src'),
  },
  html:resolve(__dirname,'../html/index.html'),
  urlLoaderLimit:8192,
  urlLoaderName:'[name]_[hash:8].[ext]',
  outputFilename:'[name].js',
  devtool:'cheap-module-eval-source-map',
  antdImport:true,
  progress:true,
  dev:{
    hot:true,
  },
  prod:{
    outputFilename:'[name]_[hash:8].js',
    extractCss:'[name]_[hash:8].css',
    clean:true,
  },
};

const defineConfig = catchError(() => {
  return require(resolve('config/config'));
},{});

module.exports = getConfig();

function getConfig(){
  const env = process.env.env;
  return {
    ...defaultConfig,
    ...defineConfig,
    ...defaultConfig[env],
    ...defineConfig[env],
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



