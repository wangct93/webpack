import React from "react";


const routes = [
  {
    path:'/2333',
    asyncComponent(){
      return import('../pages/Test2');
    },
  },
  {
    path:'/',
    asyncComponent(){
      return import('../pages/Test');
    },
  },
];


export default routes;
