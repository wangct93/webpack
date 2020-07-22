import history from '../modules/history';
import config from '../config/config';
import {Fields} from "../json/dic";
const initState = {
  pathname:history.location.pathname,
  isTabRouter: config.isTabRouter,
};

export default {
  namespace: Fields.globalNamespace,
  state: initState,

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {

  },
  subscriptions: {
    listenPathname({ history,dispatch}) {
      history.listen((match) => {
        dispatch({
          type:'updateField',
          field:'pathname',
          data:match.pathname
        });
      });
    }
  },
};

