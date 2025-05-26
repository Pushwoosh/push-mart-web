import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Subscription from './Subscription';
import Inbox from './Inbox/Inbox';

function Navigation({ showCart, showInbox, subscription }) {
  return (
    <div className="col-md-12 app-navigation">
      <nav className="text-center">
        <Link className="navLink" to="/products">Products</Link>
        <a className="navLink" href="https://www.pushwoosh.com/" rel="noopener noreferrer" target="_blank">
          Pushwoosh
        </a>
        <a className="navLink" href="https://blog.pushwoosh.com/blog/" rel="noopener noreferrer" target="_blank">
          Blog
        </a>
        <Subscription className="navLink" status={subscription} />
      </nav>
      <div>
        {showInbox && (
        <Inbox />
        )}
        {showCart && (
        <Link to="/cart" className="btn btn btn-shadow">
          <img src="/images/icon-shopping-cart.svg" alt="Cart" />
        </Link>
        )}
      </div>
    </div>
  );
}

Navigation.defaultProps = {
  showInbox: false,
};

Navigation.propTypes = {
  showCart: PropTypes.bool.isRequired,
  showInbox: PropTypes.bool,
  subscription: PropTypes.string.isRequired,
};

export default Navigation;
