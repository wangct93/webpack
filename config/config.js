
module.exports = {
  routes:[
    {
      path:'/',
      component:'Test',
      indexPath:'/ttt',
      children:[
        {
          path:'/ttt',
          component:'Test2'
        }
      ]
    }
  ],
  devServer:{
    port:3212
  },
  isSelf:true
};