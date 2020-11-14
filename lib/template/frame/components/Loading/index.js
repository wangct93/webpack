import React from 'react';
import {Spin} from 'antd';
import './index.less';
import DefineComponent from "../DefineComponent";
import {classNames, getProps} from "@wangct/util";

/**
 * 加载中组件
 */
export default class Loading extends DefineComponent {

  state = {
    isFixed:true
  };

  render() {
    const {loading,title,isFixed} = getProps(this);
    return loading ? <div className={classNames('wct-loading-wrap',isFixed && 'wct-loading-wrap-fixed')}>
      <div className="wct-loading-content">
        <Spin size="large" spinning tip={title} />
      </div>
    </div> : null
  }
}
