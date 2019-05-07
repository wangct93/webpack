import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Carousel, Input, Rate, Button} from 'antd';
import util, {reactUtil} from 'wangct-util';

import css from './Layout.less';

const dispatch = reactUtil.getDispatch('home');
const history = reactUtil.getHistory();


export function gg(){}
const {getProps} = reactUtil;
export default class Layout extends PureComponent {

  render() {
    console.log(123);
    return this.props.children || <div />
  }
}