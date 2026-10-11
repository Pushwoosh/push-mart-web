import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './styles/bootstrap.min.css';
import './styles/style.css';
import ApplicationRouter from './routes';
import store from './store';
import './tracking/cartTracker';

// Initialize the Pushwoosh command queue before the async CDN bundle
// (pushwoosh-web-notifications.js) loads. Until then window.Pushwoosh is this
// array; the CDN bootstrap later replaces it with the live SDK instance and
// replays whatever was queued. Components read window.Pushwoosh live, so they
// always talk to the current value — queue or instance.
window.Pushwoosh = window.Pushwoosh || [];

render(
  <Provider store={store}>
    <ApplicationRouter />
  </Provider>,
  document.getElementById('root'),
);
