import {createBrowserHistory,createHashHistory} from 'history';
import {setHistory} from 'wangct-util';
import config from '../config/config';
const history = config.history === 'hash' ?  createHashHistory() : createBrowserHistory();
setHistory(history);
export default history;