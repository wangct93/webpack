const util = require('wangct-server-util');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const {objectUtil} = util;
const defineConfig = require('./defineConfig');
const resolve = (...paths) => path.resolve(__dirname,'../..',...paths);
const resolveRoot = (...paths) => path.resolve(process.cwd(),...paths);

module.exports = {
  getCssRules,
  resolve,
  resolveRoot
};

function getCssRules(opt){
  const {disableCssModules} = defineConfig;

  if(disableCssModules === true){
    return [getCssRule({
      ...opt,
      disableCssModules:true
    })]
  }else{
    let noCssModulePaths = [resolveRoot('node_modules/antd')];
    if(util.isArray(disableCssModules)){
      noCssModulePaths = noCssModulePaths.concat(disableCssModules);
    }
    return [
      getCssRule({
        ...opt,
        exclude:noCssModulePaths
      }),
      getCssRule({
        ...opt,
        disableCssModules:true,
        include:noCssModulePaths
      })
    ]
  }
}


function getCssRule(opt){
  const {build,disableCssModules} = opt;
  const cssLoader = disableCssModules ? 'css-loader' : {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: true,
      localIdentName: '[name]__[local]___[hash:base64:5]'
    }
  };
  const lessLoader = {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true
    }
  };
  const use = [cssLoader,lessLoader];
  return {
    test:/\.(css|less|scss)$/,
    use:build ? ExtractTextWebpackPlugin.extract({
      fallback:'style-loader',
      use:use
    }) : ['style-loader',...use],
    ...objectUtil.clone(opt,['include','exclude'])
  };
}