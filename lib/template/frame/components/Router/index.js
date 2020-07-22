
import React,{PureComponent} from 'react';
import {Switch,Router,Route} from 'react-router-dom';
import {Provider} from "react-redux";
import {ConfigProvider} from "antd";
import ZHCN from "antd/lib/locale-provider/zh_CN";
import TabRouter from "../TabRouter";
import {getFrameState, reduxConnect} from "../../utils/state";
import {setRoutes} from "../../utils/utils";
import {pathJoin} from "../../utils/path";
import history from '../../modules/history';

/**
 * 路由组件
 */
export default class RouterMod extends PureComponent {
  render() {
    const {props} = this;
    return <Provider store={props.store}>
      <ConfigProvider locale={ZHCN}>
        <React.Fragment>
          <RouterContent defaultRoutes={props.routes} />
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
  routes:getFrameState().routes,
  isTabRouter:getFrameState().isTabRouter
}))
class RouterContent extends PureComponent{

  componentDidMount() {
    setRoutes(this.props.defaultRoutes);
  }

  render(){
    return <Router history={history}>
      {
        getRoutes(this.props.routes,undefined,this.props.isTabRouter)
      }
    </Router>
  }
}

/**
 * 全局组件
 */
@reduxConnect(() => ({
  fragmentList:getFrameState().fragmentList,
}))
class Fragment extends PureComponent {
  render() {
    return <React.Fragment>
      {this.props.fragmentList}
    </React.Fragment>
  }
}

/**
 * 获取路由配置
 * @param routes
 * @param indexPath
 * @param isTab
 * @returns {*}
 */
export function getRoutes(routes,indexPath,isTab){
  if(!routes){
    return;
  }
  if(isTab){
    return <TabRouter options={routes} />
  }
  return <Switch>
    {
      routes.map((route) => {
        const {path:routePath,component:RouteComponent = 'div',children = [],indexPath} = route;
        const props = {
          key:routePath,
          path:routePath
        };
        props.render = props => {
          return <RouteComponent {...props}>
            {
              children && children.length && getRoutes(children.map(childRoute => ({...childRoute,path:pathJoin(routePath,childRoute.path)})),indexPath && pathJoin(routePath,indexPath),route.isTab)
            }
          </RouteComponent>
        };
        return <Route {...props} />
      })
    }
    {
      indexPath ? <Route render={() => history.push(indexPath)} exact key="redirectRoute" path="/" /> : ''
    }
  </Switch>;
}
