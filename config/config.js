
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);

module.exports = {
  entry:[resolve('src/index.js')],
  routes:[
    {
      path:'/',
      component:'Test'
    }
  ],
  devServer:{
    port:3212
  },
  isSelf:true,
  // typescript:true
};