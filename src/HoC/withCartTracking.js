import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeSubscription, setUserId, userRegistered } from '../actions/app';
import { updateUnreadMessagesCount, updateInboxMessages, mockInboxMessages } from '../actions/inbox';
import {
  addToCart, removeFromCart, clearCart, changeProductQuantity, restoreCart,
} from '../actions/cart';
import changeWishList from '../actions/wish';
import { initGoogleAnalytics, initHotjarTracking } from '../utils/googleAnalytics';
import parseQueryString from '../utils/parseQueryString';
import { isEmail, normalizeUserId, postOrderCreated } from '../tracking/pwEvents';
import { completeOrder, resendCart } from '../tracking/cartTracker';

const setTags = (tags) => window.Pushwoosh.push((api) => api.setTags(tags));

const postEvent = (event, attributes = {}) => (
  window.Pushwoosh.push((api) => api.postEvent(event, attributes))
);

const withCartTracking = (WrappedComponent) => {
  class CartTracking extends Component {
    constructor(props) {
      super(props);
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
      if (nextProps.wish.length !== this.props.wish.length) {
        setTags({
          WishList: nextProps.wish,
        });
      }
    }

    onChangePermission() {
      // Only ever invoked from the onPermission* handlers below, which the SDK
      // fires after init — the instance (and its driver) is guaranteed here.
      this.props.changeSubscription(window.Pushwoosh.driver.getPermission());
    }

    // As the plugins do: the email is the userId and gets its own email channel.
    // registerEmail reads the current userId, so it must wait for registerUser.
    registerUser() {
      const userId = normalizeUserId(this.props.app.userId);
      if (!userId) {
        return;
      }
      this.props.setUserId(userId);
      window.Pushwoosh.push(async (api) => {
        try {
          await api.registerUser(userId);
        } catch (error) {
          console.error('Pushwoosh: registerUser failed', error); // eslint-disable-line no-console
          return;
        }
        this.props.userRegistered(userId);
        // A rejected email (status 210) leaves the user registered: the cart still moves to it.
        if (isEmail(userId)) {
          try {
            await api.registerEmail(userId);
          } catch (error) {
            console.error('Pushwoosh: registerEmail failed', error); // eslint-disable-line no-console
          }
        }
        resendCart();
      });
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
      const { app, cart, clearCart: flushCart } = this.props;
      if (cart.length === 0) {
        return;
      }

      postOrderCreated({ orderId: `PM-${Date.now()}`, cart, userId: app.registeredUserId || '' });
      // Kept for the demo account's running journey; sent without products,
      // so purchases stay out of the recommender's viewed tail.
      postEvent('CheckoutSuccess');

      completeOrder();
      flushCart();

      if (subscribe) {
        this.subscribe();
      }
    }

    initSDK() {
      if (!this.props.app.code) {
        return;
      }
      if (Array.isArray(window.Pushwoosh) || !window.Pushwoosh.ready) {
        const { autoSubscribe } = parseQueryString(window.location.search);

        window.Pushwoosh.push(['init', {
          logLevel: 'debug',
          applicationCode: this.props.app.code,
          ...(this.props.app.apiUrl ? { pushwooshUrl: this.props.app.apiUrl } : {}),
          unifiedPlatform: true,
          defaultNotificationTitle: 'PushMart Online Shop',
          defaultNotificationImage: 'https://go.pushwoosh.com/img/web_sdk_ico.png',
          autoSubscribe: !!autoSubscribe,
          subscribeWidget: {
            enable: true,
            bgColor: '#3FE3AB',
          },
          webPopups: {
            enable: true,
          },
          // the 404 block is rendered by React after load, so the SDK must keep watching for it
          recommendations: {
            spa: true,
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
      registeredUserId: PropTypes.string,
      code: PropTypes.string,
      apiUrl: PropTypes.string,
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
    userRegistered: PropTypes.func.isRequired,
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
    restoreCart,
    changeSubscription,
    changeProductQuantity,
    updateUnreadMessagesCount,
    updateInboxMessages,
    mockInboxMessages,
    setUserId,
    userRegistered,
  };

  return connect(mapStateToProps, bindActions)(CartTracking);
};

export default withCartTracking;
