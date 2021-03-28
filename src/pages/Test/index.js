import React, {PureComponent} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';

import css from './index.less';
import {random} from "@wangct/util/lib/util";
import {pathTo, updateModel} from "../../frame";

export default class Home extends PureComponent {

  doTest = () => {
    pathTo('/2333')
  }

  render() {
    console.log(this.props);
    return <div className={css.container} onClick={this.doTest}>
      测试页面hello world！d2131
    </div>
  }
}
