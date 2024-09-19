import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './Navigation';
import PWLogo from './PWLogo/PWLogo';


const Layout = (props) => {
    const {
        showNavigation,
        headerText,
        subscription,
        showCart,
        showInbox,
        children,
    } = props;

    return (
        <div>
            <div className="notification">
                <div className="notification-body">
                    <PWLogo />
                    <span>
                        This is a sandbox where you can explore the possibilities of Pushwoosh
                        Web SDK. Feel free to subscribe for pushes and test it!
                    </span>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-center">
                            {headerText}
                        </h1>
                    </div>
                    {showNavigation && (
                        <Navigation
                            showInbox={showInbox}
                            showCart={showCart}
                            subscription={subscription}
                        />
                    )}
                </div>
                <hr />
                {children}
            </div>
        </div>
    );
};

Layout.propTypes = {
    showNavigation: PropTypes.bool,
    showCart: PropTypes.bool,
    showInbox: PropTypes.bool,
    headerText: PropTypes.string,
    subscription: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
    showNavigation: false,
    showCart: false,
    showInbox: false,
    headerText: '',
    subscription: 'default',
};


export default Layout;
