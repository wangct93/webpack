/**
 * Created by wangct on 2019/3/4.
 */

const Babel = require('wangct-babel');

new Babel({
  src:'es',
  output:'lib',
  success(){
    console.log('success')
  }
});