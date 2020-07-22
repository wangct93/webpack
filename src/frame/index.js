import './styles/global.less';
import React from 'react';
import {render as reactDomRender} from 'react-dom';
import selfModels from './models';
import {getElem} from "./utils/utils";
import {getStore} from "./modules/store";
import {setStore} from "./utils/state";
import RouterMod from "./components/Router";

export history from './modules/history';
export * from './utils/request';
export * from './utils/utils';
export * from './utils/path';
export * from './utils/state';

/**
 * 渲染方法
 */
export function appStart(elem = 'root'){
  const routesPro = import('./config/routes').then(mod => mod.default);
  const modelsPro = import('./config/models').then(mod => mod.default);
  return Promise.all([routesPro,modelsPro]).then(([routes,models]) => {
    elem = getElem(elem);
    const store = getStore([...models,...selfModels]);
    setStore(store);
    reactDomRender(<RouterMod store={store} routes={routes} />,elem);
  });
}






