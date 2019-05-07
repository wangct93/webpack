import React,{PureComponent} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {createBrowserHistory} from 'history';
import {Switch,Router,Route,Redirect} from 'react-router-dom';
import util,{arrayUtil} from 'wangct-util';
import Layout from './Layout/Layout';
import models from './temp/model';
import routes from './temp/router';

const history = createBrowserHistory();

class Container extends PureComponent {
  render(){
    return <Provider store={getStore(models)}>
      <Layout >
        <Router history={history}>
          {
            getRoutes(routes)
          }
        </Router>

      </Layout>
    </Provider>
  }
}

console.log(history);

render(<Container />,document.getElementById('root'));




function getStore(models){

  const store = createStore((state,action) => {
    const [namespace,funcField] = (action.type || '').split('/');
    const {reducers = {},effects = {}} = models.find(item => item.namespace === namespace) || {};
    const updateState = {};
    if(effects[funcField]){
      const gener = effects[funcField](action,{
        put:put.bind(this,namespace),
        select,
        call
      });
      loopGenerator(gener);
    }

    if(reducers[funcField]){
      updateState[namespace] = reducers[funcField](state[namespace],action);
    }
    return {
      ...state,
      ...updateState
    }
  },arrayUtil.toObject(models,'namespace',item => item.state))


  function put(namespace,action){
    getDispatch(namespace)(action);
    return Promise.resolve(action);
  }

  function select(func){
    return Promise.resolve(func(store.getState()))
  }

  function call(...args){
    const target = args[0];
    if(util.isPromise(target)){
      return target;
    }else if(util.isFunc(target)){
      return target(...args.slice(1));
    }else{
      return Promise.resolve(args);
    }
  }

  models.forEach(({subscriptions,namespace}) => {
    if(subscriptions){
      Object.keys(subscriptions).forEach(key => {
        util.callFunc(subscriptions[key],{
          dispatch:getDispatch(namespace),
          history
        })
      })
    }
  });

  function getDispatch(namespace = 'global'){
    return (action) => {
      store.dispatch({
        ...action,
        type:formatType(action.type,namespace)
      })
    }
  }

  function formatType(type = '',namespace){
    const [typespace,funcField] = type.split('/');
    return funcField ? type : namespace + typespace
  }

  return store;
}



function loopGenerator(gener,params){
  const {value,done} = gener.next(params);
  if(!done){
    if(util.isPromise(value)){
      value.then(data => {
        loopGenerator(gener,data);
      })
    }else{
      loopGenerator(gener,value);
    }
  }
}

function getRoutes(routes,indexPath){
  return <Switch>
    {
      routes.map(({path:oPath,component:RouteComponent = React.Fragment,children = [],indexPath}) => {
        const path = (oPath.startsWith('/') ? '' : '/') + oPath;
        const props = {
          key:path,
          path
        };
        if(children.length){
          const basePath = path === '/' ? '' : path;
          props.render = props => {
            const option = RouteComponent === React.Fragment ? {} : props;
            return <RouteComponent {...option}>
              {
                getRoutes(children.map(childRoute => ({...childRoute,path:basePath + childRoute.path})),indexPath && basePath + indexPath)
              }
            </RouteComponent>
          }
        }else{
          props.component = RouteComponent;
        }
        return <Route {...props} />
      })
    }
    {
      indexPath ? <Redirect key="redirectRoute" to={indexPath}/> : ''
    }
  </Switch>
}