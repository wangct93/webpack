
import React,{PureComponent} from 'react';
import {Switch,Router,Route} from 'react-router-dom';
import {Provider} from "react-redux";
import {ConfigProvider} from "antd";
import ZHCN from "antd/lib/locale-provider/zh_CN";
import TabRouter from "../TabRouter";
import {getFragmentList, getRoutes, isTabRouter, reduxConnect, setRoutes} from "../../utils/state";
import {pathJoin} from "../../utils/path";
import history from '../../modules/history';
import Async from "../Async";
import {pathTo} from "../../utils/path";

/**
 * 路由组件
 */
export default class RouterMod extends PureComponent {
  render() {
    const {props} = this;
    return <Provider store={props.store}>
      <ConfigProvider locale={ZHCN}>
        <React.Fragment>
          <RouterContent />
          <Fragment />
        </React.Fragment>
      </ConfigProvider>
    </Provider>
  }
}

/**
 * 路由内容
 */
@reduxConnect(({}) => ({
  routes:getRoutes(),
  isTabRouter:isTabRouter(),
}))
class RouterContent extends PureComponent{

  render(){
    return <Router history={history}>
      {
        getRoutesContent(this.props.routes,undefined,this.props.isTabRouter)
      }
    </Router>
  }
}

/**
 * 全局组件
 */
@reduxConnect(() => ({
  content:getFragmentList(),
}))
class Fragment extends PureComponent {
  render() {
    return <React.Fragment>
      {this.props.content}
    </React.Fragment>
  }
}

/**
 * 获取路由配置
 * @param routes
 * @param indexPath
 * @param isTab
 * @param rootPath
 * @returns {*}
 */
export function getRoutesContent(routes,indexPath,isTab,rootPath = '/'){
  if(!routes){
    return;
  }
  if(isTab){
    return <TabRouter options={routes} />;
  }
  return <Switch>
    {
      routes.map((route) => {
        const {path:routePath,children = [],indexPath,asyncComponent} = route;
        let {component:RouteComponent = ReactFragment} = route;
        const props = {
          key:routePath,
          path:routePath
        };
        const extProps = {};
        if(asyncComponent){
          RouteComponent = Async;
          extProps.getComponent = asyncComponent;
        }
        props.render = props => {
          return <RouteComponent {...props} {...extProps} {...route.props}>
            {
              children && children.length && getRoutesContent(children.map(childRoute => ({...childRoute,path:pathJoin(routePath,childRoute.path)})),indexPath && pathJoin(routePath,indexPath),route.isTab,routePath)
            }
          </RouteComponent>
        };
        return <Route {...props} />;
      })
    }
    {
      indexPath ? <Route render={() => {
        setTimeout(() => {
          pathTo(indexPath);
        },0)
      }} exact key="redirectRoute" path={rootPath} /> : ''
    }
  </Switch>;
}

class ReactFragment extends PureComponent {
  state = {};

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
