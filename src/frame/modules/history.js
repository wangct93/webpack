import {createBrowserHistory,createHashHistory} from 'history';
import config from '../config/config';
const history = config.history === 'hash' ?  createHashHistory() : createBrowserHistory();
export default history;
