import React from 'react';
import {render} from 'react-dom';
import css from './index.less';
import n from './a.json';
import Img from './user1.jpg';


render(<div>hello<img src={Img} /></div>,document.getElementById('root'))



console.log(Img);
console.log(n);
console.log(css);