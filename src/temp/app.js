import React, {PureComponent} from 'react';
import {Provider} from "react-redux";
import store from './store';
import Router from './router';


export default class Home extends PureComponent {
  render() {
    return <Provider store={store}>
      <Router />
    </Provider>
  }
}