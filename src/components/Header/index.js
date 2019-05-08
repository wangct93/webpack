import React, {PureComponent} from 'react';
import util, {reactUtil} from 'wangct-util';

import css from './Header.less';

const dispatch = reactUtil.getDispatch('home');
const history = reactUtil.getHistory();


const {getProps} = reactUtil;
export default class Header extends PureComponent {
  render() {
    return <div className={css.container}>

    </div>
  }
}