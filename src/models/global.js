
export default {
  namespace: 'global',
  state: {
    data:{},
  },

  effects: {
  },

  watch:{
    name:(name) => {
      console.log(name);
      return {
        ww:'wangct',
      }
    },
    'name,ww'(name,ww){
      console.log(name,ww,this);
      return {
        fullName:name + '_' + ww,
      }
    },
    'data.name'(name){
      console.log(name);
    }
  },

  reducers: {
  },
  subscriptions: {
  },
};

