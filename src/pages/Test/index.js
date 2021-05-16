import React, {PureComponent, useCallback, useEffect, useState} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';

import css from './index.less';
import {random} from "@wangct/util/lib/util";
import {getStore, pathTo, reduxConnect, updateModel} from "../../frame";
import {useSelector} from "react-redux";
import {isFunc} from "@wangct/util/lib/typeUtil";
import {equal} from '@wangct/util';
import {useRedux} from "../../../lib/template/frame/utils/hook";

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
      <A />
      测试页面hello world！d2131
    </div>
  }
}

function A(){
  const a = useRedux((state) => state.global.name);
  console.log(a);
  return <div>123</div>;
}
