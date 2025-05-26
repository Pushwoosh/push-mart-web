import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Cart } from '../components';
import withCartTracking from '../HoC/withCartTracking';

class CartContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.closeModalHandler = this.closeModal.bind(this);
    this.openModalHandler = this.openModal.bind(this);
    this.changeQuantityHandler = this.changeQuantity.bind(this);
  }

  getTotalPrice() {
    const { cart } = this.props;
    const price = cart.reduce((sum, { price: itemPrice, quantity }) => {
      const totalItemPrice = +itemPrice * quantity;
      return sum + totalItemPrice;
    }, 0);
    return price.toFixed(2);
  }

  changeQuantity(productName, enlarge) {
    const { cart } = this.props;
    const product = cart.find((item) => item.name === productName);

    if (!enlarge && product.quantity <= 1) {
      return this.props.removeFromCart(productName);
    }

    return this.props.changeProductQuantity(productName, enlarge);
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal(doSubscribe) {
    this.setState({ showModal: false }, () => this.props.checkout(doSubscribe));
  }

  render() {
    const { app: { subscription }, cart } = this.props;

    return (
      <Layout
        showNavigation
        showInbox
        showCart={false}
        headerText="Shopping Cart"
        subscription={subscription}
      >
        <Cart
          cartItems={cart}
          total={this.getTotalPrice()}
          showModal={this.state.showModal}
          openModalHandler={this.openModalHandler}
          closeModalHandler={this.closeModalHandler}
          isSubscribed={subscription !== 'default'}
          changeQuantityHandler={this.changeQuantityHandler}
        />
      </Layout>
    );
  }
}

CartContainer.propTypes = {
  app: PropTypes.shape({
    code: PropTypes.string.isRequired,
    subscription: PropTypes.string.isRequired,
  }).isRequired,
  cart: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    nameLocal: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    quantity: PropTypes.number,
  }).isRequired).isRequired,
  checkout: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  changeProductQuantity: PropTypes.func.isRequired,
};

export default withCartTracking(CartContainer);
