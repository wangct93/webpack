
module.exports = {
  routes:[
    {
      path:'/',
      component:'Test'
    }
  ],
  devServer:{
    port:8888,
    proxy:{
      '/api/':'http://localhost:9999'
    }
  }
};