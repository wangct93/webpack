
const util = require('wangct-server-util');

module.exports = {
  entry:{
    main:util.resolve('src/index.js')
  },
  routes:[
    {
      path:'/',
      component:'Test'
    }
  ],
  devServer:{
    port:3212
  },
  dynamicImport:true,
  eslint:true,
};