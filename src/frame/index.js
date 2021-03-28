import './styles/global.less';
import React from 'react';
import {render} from 'react-dom';
import {getElem} from "./utils/utils";
import {getStore} from "./modules/store";
import {setStore} from "./utils/state";
import RouterMod from "./components/Router";

export DefineComponent from './components/DefineComponent';
export history from './modules/history';
export * from './utils/request';
export * from './utils/utils';
export * from './utils/path';
export * from './utils/state';
export * from './utils/alert';

/**
 * 渲染方法
 */
export async function appStart(elem = 'root'){
  // const routesPro = import('./config/routes').then(mod => mod.default);
  const models = await import('./models').then(mod => mod.default);
  elem = getElem(elem);
  const store = getStore(models);
  setStore(store);
  render(<RouterMod store={store} />,elem);
}






