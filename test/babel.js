
const Babel = require('wangct-babel');


new Babel({
  src:'es',
  output:'lib',
  success(){
    console.log('123');
  }
});