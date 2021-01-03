import React from "react";
import {message} from "antd";
import {toStr} from "@wangct/util/lib/stringUtil";

/**
 * 提示正确信息
 * @param msg
 */
export function alertSucInfo(msg){
  message.success(toStr(msg));
}

/**
 * 提示错误信息
 * @param msg
 */
export function alertErrInfo(msg){
  message.error(toStr(msg));
}
