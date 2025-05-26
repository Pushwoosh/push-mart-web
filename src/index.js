import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './styles/bootstrap.min.css';
import './styles/style.css';
import ApplicationRouter from './routes';
import store from './store';

render(
  <Provider store={store}>
    <ApplicationRouter />
  </Provider>,
  document.getElementById('root'),
);
