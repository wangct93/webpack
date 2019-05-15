
const Babel = require('wangct-babel');
const {getJsRule} = require('../es/config/util');

new Babel({
  src:'es',
  output:'lib',
  option:getJsRule().use[0].options,
  success(){
    console.log('123');
  }
});