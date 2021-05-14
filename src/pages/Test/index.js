import React, {PureComponent} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';

import css from './index.less';
import {random} from "@wangct/util/lib/util";
import {pathTo, reduxConnect, updateModel} from "../../frame";

@reduxConnect(({global}) => {
  console.log(global);
  return {};
})
export default class Home extends PureComponent {

  doTest = () => {
    updateModel('global',{
      ww:random(),
      name:random(),
      data:{
        name:'nae' + random(),
      },
    });
  }

  render() {
    console.log(this.props);
    return <div className={css.container} onClick={this.doTest}>
      测试页面hello world！d2131
    </div>
  }
}
