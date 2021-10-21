import useRedux from "./useRedux";
import {Fields} from "../../json/dic";

/**
 * 使用全局redux
 * @returns {{setElem: Function, getElem: (function(): *)}}
 */
export default function useGlobalRedux(){
  return useRedux(Fields.globalNamespace);
}
