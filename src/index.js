/* global document */

import React from 'react';
import { Pushwoosh } from 'web-push-notifications';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './styles/bootstrap.min.css';
import './styles/style.css';
import ApplicationRouter from './routes';
import store from './store';

const pushwoosh = new Pushwoosh();

window.Pushwoosh = pushwoosh;

export const getPushwoosh = () => pushwoosh;


render(
    <Provider store={store}>
        <ApplicationRouter />
    </Provider>,
    document.getElementById('root'),
);
