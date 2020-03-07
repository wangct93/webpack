/**
 * 返回symbol数据格式
 * @returns {symbol}
 */
function s(...args){
  return Symbol(...args);
}

exports.EnumEnv = {
  dev:'dev',
  prod:'prod',
};

exports.babelOptions = {
  presets: ['@babel/preset-react','@babel/preset-env'],
  plugins:[
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators',{legacy:true}],
    ['@babel/plugin-proposal-class-properties',{loose:true}],
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
  ],
};
