import {PureComponent} from "react";
import {toAry, toPromise} from "@wangct/util";

/**
 * 自定义组件
 */
export default class DefineComponent extends PureComponent {

  updateState(type,value){
    const [parentField,field] = type.split('.');
    this.setState({
      [parentField]:field ? {
        ...this.state[parentField],
        [field]:value,
      } : value,
    });
  }

  getOptions(){
    return toAry(this.getProp('options'));
  }

  getValue(){
    return this.getProp('value');
  }

  loadOptions(){
    const loadOptions = this.getProp('loadOptions');
    if(!loadOptions){
      return;
    }
    toPromise(loadOptions).then(options => {
      this.setState({
        options
      });
    });
  }

  loadData(){
    const loadData = this.getProp('loadData');
    if(!loadData){
      return;
    }
    toPromise(loadData).then(data => {
      this.setState({
        data
      });
    })
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
    return this.state && this.state[key];
  }

}
