
import React from 'react';
import {render} from 'react-dom';


render(<div>
  <div style={{height:200}} onClick={doTest}></div>
</div>,document.getElementById('root'));


function doTest(){
  import('./test');
}

export const name = 1;
