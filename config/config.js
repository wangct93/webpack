
const util = require('wangct-server-util');

module.exports = {
  entry:{
    main:util.resolve('src')
  },
  routes:[
    {
      path:'/',
      component:'Test'
    }
  ],
  dynamicImport:true,
  eslint:true,
};