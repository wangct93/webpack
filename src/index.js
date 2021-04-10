// import {appStart, setRoutes} from "./frame";
// import routes from "./json/routes";
// appStart().then(() => {
//   setRoutes(routes);
// });
import React from "react";
import {render} from 'react-dom';
import {appStart, setRoutes} from "./frame";
import {Flex} from '@wangct/react';



appStart().then(() => {
  setRoutes([
    {
      path:'/',
      component:() => {
        return <div>
          <Flex>
            <div>12</div>
            <Flex.Item>123</Flex.Item>
          </Flex>
        </div>;
      }
    }
  ])
});
