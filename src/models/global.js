
export default {
  namespace: 'global',
  state: {
  },

  effects: {
  },

  watchs:{
    name:(name,state) => {
      console.log(name,state);
      return {
        ww:'wangct',
      }
    },
    'name,ww':(name,ww,state) => {
      console.log(name,ww,state);
      return {
        ww:'wangct1',
      }
    },
  },

  reducers: {
  },
  subscriptions: {
  },
};

