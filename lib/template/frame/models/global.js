import history from '../modules/history';
import config from '../config/config';
import {Fields} from "../json/dic";
import {random} from "@wangct/util/lib/util";
import {updateModel} from "../utils/state";

const initState = {
  pathname:history.location.pathname,
  isTabRouter: config.isTabRouter,
  resizeSign:random(),
};

const namespace = Fields.globalNamespace;

export default {
  namespace: namespace,
  state: initState,

  effects: {

  },

  reducers: {

  },
  subscriptions: {
    listenPathname,
    windowResize,
  },
};

/**
 * 窗口大小改变监听事件
 */
function windowResize(){
  window.addEventListener('resize',() => {
    updateModel(namespace,{
      resizeSign:random(),
    });
  })
}

/**
 * 监听路径改变事件
 */
function listenPathname(){
  history.listen((match) => {
    updateModel(namespace,{
      pathname:match.pathname,
    });
  });
}
