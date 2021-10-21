import React from "react";

/**
 * 判断是否为类组件
  * @param Com
 * @returns {boolean}
 */
export function isClassComponent(Com){
  return Com.prototype instanceof React.Component;
}
