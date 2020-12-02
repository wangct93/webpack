import React, {PureComponent} from "react";
import {Tabs} from 'antd';
import css from './index.less';
import {toAry} from "@wangct/util";
import {getPathname, reduxConnect} from "../../utils/state";
import {getRoutes} from "../Router";
import {pathJoin} from "../../utils/path";

/**
 * 选项卡路由器
 */
@reduxConnect(() => ({
  pathname:getPathname(),
}))
export default class TabRouter extends PureComponent {

  getOptions(){
    return toAry(this.props.options);
  }

  getActiveKey(){
    const options = this.getOptions();
    const target = options[this.getActiveIndex()];
    return target && target.path;
  }

  getActiveIndex(){
    const options = this.getOptions();
    const {pathname} = this.props;
    return options.findIndex((opt) => {
      return pathname.startsWith(opt.path);
    });
  }

  render() {
    const activeIndex = this.getActiveIndex();
    return <Tabs
      className={css.container}
      activeKey={this.getActiveKey()}
    >
      {
        this.getOptions().map((opt,index) => {
          return <Tabs.TabPane key={opt.path} tab={opt.path}>
            <TabComMod route={opt} destroy={index > activeIndex} />
          </Tabs.TabPane>
        })
      }
    </Tabs>
  }
}

class TabComMod extends PureComponent {
  state = {
    hide:false,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkDestroy(prevProps);
  }

  checkDestroy(prevProps){
    if(prevProps.destroy !== this.props.destroy){
      if(this.props.destroy){
        setTimeout(() => {
          this.setState({
            hide:true,
          });
        },300);
      }else{
        this.setState({
          hide:false,
        });
      }
    }
  }

  getData(){
    return this.props.route || {};
  }

  render() {
    if(this.state.hide){
      return null;
    }
    const {component:Com,children,path:routePath,indexPath,isTab} = this.getData();
    return <Com >
      {
        children && children.length && getRoutes(children.map(childRoute => ({...childRoute,path:pathJoin(routePath,childRoute.path)})),indexPath && pathJoin(routePath,indexPath),isTab)
      }
    </Com>;
  }
}
