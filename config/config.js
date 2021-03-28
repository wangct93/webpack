
const util = require('@wangct/node-util');

const {resolve} = util;

module.exports = {
  // entry:resolve('src'),
  entry:{
    index:[resolve('src')]
  },
  port:'8981',
  mode:'development',
  prod:{
    outputPublicPath: './',
  },
  externals:{
    // react:'React',
  },
  proxy:{
    '/api':'http://localhost:8055'
  },
  dynamicImport:true,
  eslint:true,
  disableCssModules:[resolve('node_modules')]
};
