import util,{reactUtil} from 'wangct-util';

export default {
  namespace: 'global',
  state: {
    name:'wangct'
  },

  effects: {
    *effectTest(action , { call, put,select }) {  // eslint-disable-line
      const data = yield call(new Promise(cb => cb('wangct')));
      yield put({
        type:'updateField',
        field:'name',
        data:data + '_' + util.random()
      });
      const state  = yield select(state => state);
      console.log(state);
    },
  },

  reducers: {
    updateField(state,{field,data}){
      const extState = field === 'multiple' ? data : {[field]:data};
      return {
        ...state,
        ...extState
      }
    },
  },
  subscriptions: {
    setup({ history,dispatch}) {
      reactUtil.setHistory(history);
      reactUtil.setDispatch(dispatch);
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

