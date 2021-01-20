import React, {PureComponent} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';

import css from './index.less';
import {random} from "@wangct/util/lib/util";
import {pathTo, updateModel} from "../../frame";

console.log(2222222);

export default class Home extends PureComponent {

  doTest = () => {
    pathTo('/')
  }

  render() {
    console.log(this.props);
    return <div className={css.container} onClick={this.doTest}>
      测试页面hello2
    </div>
  }
}
