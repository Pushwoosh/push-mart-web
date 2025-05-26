import React from 'react';
import PropTypes from 'prop-types';
import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Products, AppCodePrompt, Cart } from './containers';
import parseQueryString from './utils/parseQueryString';
import store from './store';

function RouteWithAppCode({ component: Component, ...rest }) {
  const state = store.getState();

  return (
    <Route
      {...rest}
      render={(props) => (
        state.app.code ? (
          <Component
            {...props}
          />
        ) : (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        )
      )}
    />
  );
}

RouteWithAppCode.propTypes = {
  component: PropTypes.elementType.isRequired,
};

function RootRoute(rootProps) {
  const queryParams = parseQueryString(rootProps.location.search);
  const state = store.getState();
  const applicationCode = queryParams.appcode;
  const { hash } = window.location;

  if (applicationCode) {
    return (
      <Route
        {...rootProps}
        render={() => <AppCodePrompt applicationCode={applicationCode} />}
      />
    );
  }

  return (
    <Route
      {...rootProps}
      render={() => (
        state.app.code ? (
          <Redirect to={{ pathname: `/products/${hash}` }} />
        ) : (
          <Redirect to={{ pathname: `/appcode/${hash}` }} />
        )
      )}
    />
  );
}

function ApplicationRouter() {
  return (
    <Router history={createBrowserHistory()}>
      <Switch>
        <Route
          path="/appcode"
          component={AppCodePrompt}
        />
        <RouteWithAppCode
          path="/products"
          component={Products}
        />
        <RouteWithAppCode
          path="/cart"
          component={Cart}
        />
        <RootRoute
          path="/"
        />
      </Switch>
    </Router>
  );
}

export default ApplicationRouter;
