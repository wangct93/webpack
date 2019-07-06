
const util = require('wangct-server-util');

const {resolve} = util;

module.exports = {
  // entry:resolve('src'),
  routes:[
    {
      path:'/',
      component:'Test'
    },
    {
      path:'/2333',
      component:'Test'
    },
  ],
  output:{
    build:{
      publicPath:'./'
    }
  },
  proxy:{
    '/api':'http://localhost:8055'
  },
  dynamicImport:true,
  eslint:true
};