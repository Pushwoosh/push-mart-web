import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Layout, NotFound, ProductPage, Recommendations,
} from '../components';
import withCartTracking from '../HoC/withCartTracking';
import { findProduct } from '../data/catalog';
import { postProductView } from '../tracking/pwEvents';

class ProductContainer extends Component {
  componentDidMount() {
    this.trackView();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.trackView();
    }
  }

  trackView() {
    const product = findProduct(this.props.match.params.id);
    if (product && this.props.app.code) {
      postProductView(product, this.props.app.registeredUserId);
    }
  }

  render() {
    const {
      app: { code, subscription }, cart, addToCart, removeFromCart, match,
    } = this.props;
    const product = findProduct(match.params.id);

    if (!product) {
      return <NotFound />;
    }

    return (
      <Layout
        showCart={!!code}
        showInbox={!!code}
        showNavigation
        headerText="PushMart Online Shop"
        subscription={subscription}
      >
        <ProductPage
          product={product}
          isInCart={cart.some((item) => item.id === product.id)}
          hasAppCode={!!code}
          addToCartHandler={addToCart}
          removeFromCartHandler={removeFromCart}
        />
        <Recommendations
          title="Bought together"
          request={{
            strategy: 'also_bought', productId: product.id, fallback: 'bestsellers_30d', limit: 4, block: 'pdp-also-bought',
          }}
        />
      </Layout>
    );
  }
}

ProductContainer.propTypes = {
  app: PropTypes.shape({
    code: PropTypes.string,
    registeredUserId: PropTypes.string,
    subscription: PropTypes.string.isRequired,
  }).isRequired,
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export default withCartTracking(ProductContainer);
