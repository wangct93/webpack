
import {Tooltip} from "antd";
import React from "react";
import css from './columns.less';

/**
 * 省略文本提示渲染
 * @param v
 */
export function textOverflowRender(v){
  return <div className={css.text_overflow}>
    <Tooltip title={v}>
      <div className={css.text_overflow_content}>{v}</div>
    </Tooltip>
  </div>;
}
