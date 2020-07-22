import React, {PureComponent} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';

import css from './index.less';

import IMG from '../../assets/id_user.jpg';

export default class Home extends PureComponent {
  render() {
    return <div className={css.container}>
      <img width={200} src={IMG} alt="wd" />
      测试页面hello world！d2131
    </div>
  }
}
