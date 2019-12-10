const {aryToObject,resolve} = require("wangct-server-util");

const baseConfig = {
  port:process.env.port || 9580,
  urlLoaderLimit:8192,
  urlLoaderName:'[name]_[hash:8].[ext]',
  outputFilename:'[name].js',
  devtool:'cheap-module-eval-source-map',
  antdImport:true,
  pro:{
    outputFilename:'[name]_[hash:8].js',
    extractCss:'[name]_[hash:8].css',
  }
};

const defineConfig = catchError(() => {
  return require(resolve('config/config'));
},{});

exports.getConfig = getConfig;
exports.catchError = catchError;
exports.config = getConfig();

function getConfig(env = process.env.env){
  return {
    ...baseConfig,
    ...baseConfig[env],
    ...defineConfig,
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



