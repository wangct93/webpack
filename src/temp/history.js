import {createBrowserHistory} from 'history';
import {reactUtil} from 'wangct-util';
const history = createBrowserHistory();

reactUtil.setHistory(history);

export default history;