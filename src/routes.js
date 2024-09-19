import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import {createBrowserHistory as history} from 'history';
import { Products, AppCodePrompt, Cart } from './containers';
import parseQueryString from './utils/parseQueryString';
import store from './store';

const RouteWithAppCode = ({ component: Component, ...rest }) => {
    const state = store.getState();

    return (
        <Route
            render={props => (
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
            {...rest}
        />
    );
};

RouteWithAppCode.propTypes = {
    component: PropTypes.object.isRequired,
};

const RootRoute = (rootProps) => {
    const queryParams = parseQueryString(rootProps.location.search);
    const state = store.getState();
    const applicationCode = queryParams.appcode;
    const { hash } = window.location;

    if (applicationCode) {
        return (
            <Route
                render={() =>
                    <AppCodePrompt applicationCode={applicationCode} />
                }
                {...rootProps}
            />
        );
    }

    return (
        <Route
            render={() => (
                state.app.code ? (
                    <Redirect to={{ pathname: `/products/${hash}` }} />
                ) : (
                    <Redirect to={{ pathname: `/appcode/${hash}` }} />
                )
            )}
            {...rootProps}
        />
    );
};

const ApplicationRouter = () => (
    <Router history={history()}>
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


export default ApplicationRouter;
