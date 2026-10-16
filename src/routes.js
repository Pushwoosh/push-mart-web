import React from 'react';
import PropTypes from 'prop-types';
import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  Products, AppCodePrompt, Cart, Product,
} from './containers';
import { NotFound } from './components';
import withCartTracking from './HoC/withCartTracking';
import { saveApp, setApiUrl } from './actions/app';
import parseQueryString from './utils/parseQueryString';
import parseApiUrl from './utils/apiUrl';
import store from './store';

const APP_CODE = /^\w{5}-\w{5}$/;
const NotFoundPage = withCartTracking(NotFound);

// Links from emails and journeys carry ?appcode=, so they work in a fresh browser too.
function saveAppCodeFromQuery(search) {
  const { appcode } = parseQueryString(search);
  if (appcode && APP_CODE.test(appcode) && appcode !== store.getState().app.code) {
    store.dispatch(saveApp(appcode));
  }
}

// ?apiurl= picks the Pushwoosh API region; it sticks like the app code, ?apiurl=default resets it.
function saveApiUrlFromQuery(search) {
  const apiUrl = parseApiUrl(parseQueryString(search).apiurl);
  if (apiUrl !== null && apiUrl !== store.getState().app.apiUrl) {
    store.dispatch(setApiUrl(apiUrl));
  }
}

function RouteWithAppCode({ component: Component, ...rest }) {
  saveApiUrlFromQuery(window.location.search);
  saveAppCodeFromQuery(window.location.search);
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
  saveApiUrlFromQuery(rootProps.location.search);
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
        <Route
          path="/product/:id"
          render={(props) => {
            saveApiUrlFromQuery(props.location.search);
            saveAppCodeFromQuery(props.location.search);
            return <Product {...props} />;
          }}
        />
        <RootRoute
          exact
          path="/"
        />
        {/* on a direct 404 load nothing else starts the SDK, and its block needs it */}
        <Route
          render={(props) => {
            saveApiUrlFromQuery(props.location.search);
            saveAppCodeFromQuery(props.location.search);
            return <NotFoundPage {...props} />;
          }}
        />
      </Switch>
    </Router>
  );
}

export default ApplicationRouter;
