import {callFunc, getThrottleFunc} from "@wangct/util/lib/util";

/**
 * 鼠标按下事件
  * @param e
 * @param options
 */
export function mousedown(e,options = {}){
  const ox = e.clientX;
  const oy = e.clientY;
  const {moveLimit = 10} = options;
  let isMove = false;
  const mousemove = getThrottleFunc((event) => {
    if(isMove){
      const dx = event.clientX - ox;
      const dy = event.clientY - oy;
      callFunc(options.onMove,e,dx,dy);
    }else if(Math.abs(event.clientX - ox) > moveLimit || Math.abs(event.clientY - oy) > moveLimit){
      isMove = true;
      callFunc(options.onBeforeMove,e);
    }
  },30);
  const mouseup = (e) => {
    if(!isMove){
      callFunc(options.onClick,e);
    }else{
      callFunc(options.onUp,e,e.clientX - ox,e.clientY - oy);
    }
    document.removeEventListener('mousemove',mousemove);
    document.removeEventListener('mouseup',mouseup);
  };
  document.addEventListener('mousemove',mousemove);
  document.addEventListener('mouseup',mouseup);
}

/**
 * 打开文件上传
 * @author wangchuitong
 */
export function importFile(options = {}){
  let input = document.querySelector('.w-input-temp-hide');
  if(!input){
    input = document.createElement('input');
    input.type = 'file';
    input.style.position = 'absolute';
    input.style.left = '-1000px';
    input.style.top = '-1000px';
    input.style.opacity = '0';
    input.className = 'w-input-temp-hide';
    const inputProps = options.inputProps || {};
    Object.keys(inputProps).forEach((key) => {
      input.setAttribute(key,inputProps[key]);
    });
    // input.setAttribute('accept','image/*');

    document.body.appendChild(input);
  }

  return new Promise((cb) => {
    function onChange(e){
      const elem = e.target;
      const files = Array.from(elem.files);
      const result = options.multiple ? files : files[0];
      cb(result);
      elem.value = null;
      elem.removeEventListener('change',onChange);
    }
    const {prevChangeFunc} = input;
    if(prevChangeFunc){
      input.removeEventListener('change',prevChangeFunc);
    }
    input.addEventListener('change',onChange);
    input.prevChangeFunc = onChange;
    input.click();
  });
}

export function blobToBase64(blob){
  if(!blob){
    return null;
  }
  return new Promise((cb,eb) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      cb(e.target.result);
    };
    reader.onerror = eb;
    reader.readAsDataURL(blob);
  })

}

export function base64ToBlob(base64, filename) {
  const arr = base64.split(',');
  if(arr.length < 2){
    return base64;
  }
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}
