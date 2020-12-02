import {PureComponent} from "react";
import {toAry, toPromise} from "@wangct/util";
import {callFunc, equal} from "@wangct/util/lib/util";

/**
 * 自定义组件
 */
export default class DefineComponent extends PureComponent {

  componentDidMount() {

  }

  checkProp(prevProps,field,func){
    if(!equal(prevProps[field],this.props[field])){
      callFunc.call(this,func);
    }
  }

  getOptions(){
    return toAry(this.getProp('options'));
  }

  getValue(){
    return this.getProp('value');
  }

  getData(){
    return this.getProp('data');
  }

  getTextField(){
    return this.getProp('textField') || 'text';
  }

  getValueField(){
    return this.getProp('valueField') || 'value';
  }

  getItemValue(item){
    return item && item[this.getValueField()];
  }

  getItemText(item){
    return item && item[this.getTextField()];
  }

  setElem = (elem) => {
    this.elem = elem;
  };

  getElem(){
    return this.elem;
  }

  setTarget = (target) => {
    this.refTarget = target;
  };

  getTarget(){
    return this.refTarget;
  }

  setSubTarget = (target) => {
    this.refSubTarget = target;
  };

  getSubTarget(){
    return this.refSubTarget;
  }

  getProps(filterKeys = []){
    const props = {
      ...this.state,
      ...this.props,
    };
    toAry(filterKeys).forEach((key) => {
      delete props[key];
    });
    return props;
  }

  getProp(key){
    if(key in this.props){
      return this.props[key];
    }
    return this.getState()[key];
  }

  getState(){
    return this.state || {};
  }

  setForm = (form) => {
    this.form = form;
  };

  getForm(){
    return this.form;
  }

  formChange = (formValue) => {
    this.setState({
      formValue
    });
  };

  onChange = (value,...args) => {
    this.setState({
      value,
    });
    callFunc(this.props.onChange,value,...args);
  };

  getFormValue(){
    return this.getProp('formValue');
  }

  getSelectedKey(){
    return this.getProp('selectedKey');
  }

  setSelectedKey = (key) => {
    this.setState({
      selectedKey:key,
    });
    callFunc(this.props.onSelect,key);
  };

  isDisabled(){
    return this.getProp('disabled');
  }


}
