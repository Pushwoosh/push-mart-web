import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Cart } from '../components';
import RegisterUser from '../components/RegisterUser/RegisterUser';
import withCartTracking from '../HoC/withCartTracking';
import { findProduct } from '../data/catalog';
import { decodeCart } from '../tracking/cartTracker';
import parseQueryString from '../utils/parseQueryString';

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

  componentDidMount() {
    const { restore } = parseQueryString(this.props.location.search);
    if (!restore) {
      return;
    }

    const items = decodeCart(decodeURIComponent(restore))
      .map(({ id, quantity }) => ({ product: findProduct(id), quantity }))
      .filter(({ product }) => product)
      .map(({ product, quantity }) => ({ ...product, quantity }));
    if (items.length) {
      this.props.restoreCart(items);
    }
    this.props.history.replace(this.props.location.pathname);
  }

  getTotalPrice() {
    const { cart } = this.props;
    const price = cart.reduce((sum, { price: itemPrice, quantity }) => {
      const totalItemPrice = +itemPrice * quantity;
      return sum + totalItemPrice;
    }, 0);
    return price.toFixed(2);
  }

  changeQuantity(productId, enlarge) {
    const { cart } = this.props;
    const product = cart.find((item) => item.id === productId);

    if (!enlarge && product.quantity <= 1) {
      return this.props.removeFromCart(productId);
    }

    return this.props.changeProductQuantity(productId, enlarge);
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal(doSubscribe) {
    this.setState({ showModal: false }, () => this.props.checkout(doSubscribe));
  }

  render() {
    const {
      app: { subscription, userId }, cart, setUserId, registerUser,
    } = this.props;

    return (
      <Layout
        showNavigation
        showInbox
        showCart={false}
        headerText="Shopping Cart"
        subscription={subscription}
      >
        {cart.length > 0 && (
          <>
            <RegisterUser
              heading=""
              hint="Leave your email: we will send the receipt and remind you about the cart"
              userId={userId}
              setUserId={setUserId}
              registerUser={registerUser}
            />
            <hr />
          </>
        )}
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
    userId: PropTypes.string.isRequired,
  }).isRequired,
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameLocal: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    quantity: PropTypes.number,
  }).isRequired).isRequired,
  checkout: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  changeProductQuantity: PropTypes.func.isRequired,
  restoreCart: PropTypes.func.isRequired,
  setUserId: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withCartTracking(CartContainer);
