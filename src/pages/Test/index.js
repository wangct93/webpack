import React, {PureComponent, useCallback, useEffect, useRef, useState} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';

import css from './index.less';
import {random} from "@wangct/util/lib/util";
import {getStore, pathTo, reduxConnect, updateModel} from "../../frame";
import {useSelector} from "react-redux";
import {isFunc} from "@wangct/util/lib/typeUtil";
import {equal} from '@wangct/util';
import useMouseWheel from "../../../lib/template/frame/utils/hooks/useMouseWheel";
import useRedux from "../../../lib/template/frame/utils/hooks/useRedux";
import useWindowSize from "../../../lib/template/frame/utils/hooks/useWindowSize";
import useHover from "../../../lib/template/frame/utils/hooks/useHover";
import useElem from "../../../lib/template/frame/utils/hooks/useElem";
import usePrevState from "../../../lib/template/frame/utils/hooks/usePrevState";
import useMouse from "../../../lib/template/frame/utils/hooks/useMouse";
import useHash from "../../../lib/template/frame/utils/hooks/useHash";
import B, {FieldsA} from "./B";


export default function Test(){
  const a = useRedux((state) => state.global.name);
  const scale = useMouseWheel();
  const [b,setB] = useState();
  const [elem,setRef] = useElem();
  // console.log(useWindowSize());
  // console.log(useHover(elem));
  // console.log('上次记录',usePrevState(useHover(elem)));
  // console.log(scale);
  console.log(useMouse());
  console.log(useMouse(elem));
  console.log(useHash());
  console.log(FieldsA);
  return <div onClick={setB} ref={setRef}>123<B /></div>;
}
