import React, {PureComponent} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';

import css from './index.less';
import {random} from "@wangct/util/lib/util";
import {updateModel} from "../../frame";


export default class Home extends PureComponent {

  doTest = () => {
    updateModel('global',{
      name:random(),
    })
  }

  render() {
    return <div className={css.container} onClick={this.doTest}>
      测试页面hello world！d2131
    </div>
  }
}
