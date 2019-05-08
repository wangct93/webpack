import React, {PureComponent} from 'react';
import {Carousel, Input, Icon, Rate, Button} from 'antd';
import util, {reactUtil} from 'wangct-util';

import css from './Test.less';

const dispatch = reactUtil.getDispatch('home');
const history = reactUtil.getHistory();


const {getProps} = reactUtil;
export default class Home extends PureComponent {
  render() {
    return <div className={css.container} onClick={() => reactUtil.getHistory().push('/')}>
ffagg
    </div>
  }
}