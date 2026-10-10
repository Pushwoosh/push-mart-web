import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import differenceBy from 'lodash/differenceBy';
import last from 'lodash/last';
import { changeSubscription, setUserId } from '../actions/app';
import { updateUnreadMessagesCount, updateInboxMessages, mockInboxMessages } from '../actions/inbox';
import {
  addToCart, removeFromCart, clearCart, changeProductQuantity,
} from '../actions/cart';
import changeWishList from '../actions/wish';
import { initGoogleAnalytics, initHotjarTracking } from '../utils/googleAnalytics';
import parseQueryString from '../utils/parseQueryString';

const setTags = (tags) => window.Pushwoosh.push((api) => api.setTags(tags));

const setPurchase = (purchase) => window.Pushwoosh.push((api) => {
  api.setPurchase({
    transactionDate: new Date().toISOString(),
    currency: 'USD',
    ...purchase,
  });
});

const postEvent = (event, attributes = {}) => (
  window.Pushwoosh.push((api) => api.postEvent(event, attributes))
);

const withCartTracking = (WrappedComponent) => {
  class CartTracking extends Component {
    constructor(props) {
      super(props);
      this.isCheckout = false;
      this.removeFromCartHandler = this.props.removeFromCart.bind(this);
      this.addToCartHandler = this.props.addToCart.bind(this);
      this.changeWishListHandler = this.props.changeWishList.bind(this);
      this.checkoutHandler = this.checkout.bind(this);
      this.subscribeHandler = this.subscribe.bind(this);
      this.onChangePermission = this.onChangePermission.bind(this);
      this.registerUser = this.registerUser.bind(this);
    }

    componentDidMount() {
      initGoogleAnalytics();
      initHotjarTracking();
      this.initSDK();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const nextCartLength = nextProps.cart.length;
      const currentCartLength = this.props.cart.length;

      if (nextCartLength > currentCartLength) {
        const product = last(differenceBy(nextProps.cart, this.props.cart, (el) => el.name));
        postEvent('ProductAdd', {
          id: product.nameLocal,
        });
      }

      const isCartEmpty = nextCartLength === 0 && nextCartLength !== currentCartLength;
      if (isCartEmpty && !this.isCheckout) {
        postEvent('CartCleared');
      }

      if (nextProps.wish.length !== this.props.wish.length) {
        setTags({
          WishList: nextProps.wish,
        });
      }

      this.isCheckout = false;
    }

    onChangePermission() {
      // Only ever invoked from the onPermission* handlers below, which the SDK
      // fires after init — the instance (and its driver) is guaranteed here.
      this.props.changeSubscription(window.Pushwoosh.driver.getPermission());
    }

    registerUser() {
      const { userId } = this.props.app;
      console.log(`RegisterUserId: ${userId}`); // eslint-disable-line no-console
      window.Pushwoosh.push((api) => api.registerUser(userId));
    }

    subscribe() {
      window.Pushwoosh.push(() => {
        window.Pushwoosh.subscribe()
          .then(() => window.Pushwoosh.isSubscribed())
          .then((isSubscribed) => this.props.changeSubscription(isSubscribed ? 'granted' : 'denied'))
          .catch(() => this.props.changeSubscription('denied'));
      });
    }

    checkout(subscribe) {
      const { cart, clearCart: flushCart } = this.props;
      this.isCheckout = true;

      cart.forEach(({ quantity, nameLocal, price }) => (
        setPurchase({
          productIdentifier: nameLocal,
          quantity,
          price,
        })
      ));

      postEvent('CheckoutSuccess', { products: cart.map((item) => item.nameLocal) });

      flushCart();

      if (subscribe) {
        this.subscribe();
      }
    }

    initSDK() {
      if (Array.isArray(window.Pushwoosh) || !window.Pushwoosh.ready) {
        const { autoSubscribe } = parseQueryString(window.location.search);

        window.Pushwoosh.push(['init', {
          logLevel: 'debug',
          applicationCode: this.props.app.code,
          safariWebsitePushID: 'web.com.pushwoosh.pushon',
          defaultNotificationTitle: 'PushMart Online Shop',
          defaultNotificationImage: 'https://go.pushwoosh.com/img/web_sdk_ico.png',
          autoSubscribe: !!autoSubscribe,
          userId: this.props.app.userId,
          subscribeWidget: {
            enable: true,
            bgColor: '#3FE3AB',
          },
          webPopups: {
            enable: true,
          },
        }]);
        window.Pushwoosh.push(['onReady', () => {
          this.props.mockInboxMessages();
        }]);
        window.Pushwoosh.push(['onPutNewMessageToInboxStore', () => {
          this.updateInboxMessages();
        }]);
        window.Pushwoosh.push(['onUpdateInboxMessages', () => {
          this.updateInboxMessages();
        }]);

        window.Pushwoosh.push(['onPermissionPrompt', this.onChangePermission]);
        window.Pushwoosh.push(['onPermissionGranted', this.onChangePermission]);
        window.Pushwoosh.push(['onPermissionDenied', this.onChangePermission]);
      }
    }

    updateInboxMessages() {
      window.Pushwoosh.push(() => {
        window.Pushwoosh.pwinbox.loadMessages().then((messages) => {
          this.props.updateInboxMessages(messages);
        });
        window.Pushwoosh.pwinbox.unreadMessagesCount().then((count) => {
          this.props.updateUnreadMessagesCount(count);
        });
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          checkout={this.checkoutHandler}
          subscribe={this.subscribeHandler}
          removeFromCart={this.removeFromCartHandler}
          addToCart={this.addToCartHandler}
          changeWishList={this.changeWishListHandler}
          registerUser={this.registerUser}
        />
      );
    }
  }

  CartTracking.propTypes = {
    app: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      subscription: PropTypes.string.isRequired,
    }).isRequired,
    cart: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      nameLocal: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      quantity: PropTypes.number,
    }).isRequired).isRequired,
    wish: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    changeWishList: PropTypes.func.isRequired,
    addToCart: PropTypes.func.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    changeSubscription: PropTypes.func.isRequired,
    setUserId: PropTypes.func.isRequired,
  };

  const mapStateToProps = ({ app, cart, wish }) => ({
    app,
    cart,
    wish,
  });

  const bindActions = {
    addToCart,
    removeFromCart,
    changeWishList,
    clearCart,
    changeSubscription,
    changeProductQuantity,
    updateUnreadMessagesCount,
    updateInboxMessages,
    mockInboxMessages,
    setUserId,
  };

  return connect(mapStateToProps, bindActions)(CartTracking);
};

export default withCartTracking;
