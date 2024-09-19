import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { differenceBy, last } from 'lodash';
import { getPushwoosh } from '..';
import { changeSubscription, setUserId } from '../actions/app';
import { updateUnreadMessagesCount, updateInboxMessages, mockInboxMessages } from '../actions/inbox';
import { addToCart, removeFromCart, clearCart, changeProductQuantity } from '../actions/cart';
import changeWishList from '../actions/wish';
import { initGoogleAnalytics, initHotjarTracking } from '../utils/googleAnalytics';
import parseQueryString from '../utils/parseQueryString';


const withCartTracking = (WrappedComponent) => {
    class CartTracking extends Component {
        constructor(props) {
            super(props);
            this.PW = getPushwoosh();
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
                const product = last(differenceBy(nextProps.cart, this.props.cart, el => el.name));
                this.postEvent('ProductAdd', {
                    id: product.nameLocal,
                });
            }

            const isCartEmpty = nextCartLength === 0 && nextCartLength !== currentCartLength;
            if (isCartEmpty && !this.isCheckout) {
                this.postEvent('CartCleared');
            }

            if (nextProps.wish.length !== this.props.wish.length) {
                this.setTags({
                    WishList: nextProps.wish,
                });
            }

            this.isCheckout = false;
        }

        setTags(tags) {
            this.PW.push(api => api.setTags(tags));
        }

        registerUser() {
            const { userId } = this.props.app;
            console.log('RegisterUserId: ' + userId);
            this.PW.push(api => api.registerUser(userId));
        }

        setPurchase(purchase) {
            this.PW.push((api) => {
                api.setPurchase({
                    transactionDate: new Date().toISOString(),
                    currency: 'USD',
                    ...purchase,
                });
            });
        }

        postEvent(event, attributes = {}) {
            this.PW.push(api => api.postEvent(event, attributes));
        }

        subscribe() {
            this.PW.subscribe().then(() => {
                this.PW.isSubscribed().then((isSubscribed) => {
                    const subscription = isSubscribed ? 'granted' : 'denied';
                    this.props.changeSubscription(subscription);
                });
            });
        }

        checkout(subscribe) {
            const { cart, clearCart: flushCart } = this.props;
            this.isCheckout = true;

            cart.forEach(({ quantity, nameLocal, price }) => (
                this.setPurchase({
                    productIdentifier: nameLocal,
                    quantity,
                    price
                })
            ));

            this.postEvent('CheckoutSuccess', { products: cart.map(item => item.nameLocal) });

            flushCart();

            if (subscribe) {
                this.subscribe();
            }
        }

        initSDK() {
            if (!this.PW.ready) {
                const { facebookPageId, autoSubscribe } = parseQueryString(window.location.search);

                this.PW.push(['init', {
                    logLevel: 'debug',
                    applicationCode: this.props.app.code,
                    pushwooshApiUrl: process.env.REACT_APP_API_URL,
                    safariWebsitePushID: process.env.REACT_APP_PUSH_ID || 'web.com.pushwoosh.pushon',
                    defaultNotificationTitle: 'PushOn Online Shop',
                    defaultNotificationImage: 'https://go.pushwoosh.com/img/web_sdk_ico.png',
                    autoSubscribe: !!autoSubscribe,
                    userId: this.props.app.userId,
                    subscribeWidget: {
                        enable: true,
                        bgColor: '#3FE3AB',
                    },
                    facebook: {
                        enable: Boolean(facebookPageId),
                        containerClass: 'websdk-facebook',
                        pageId: facebookPageId,
                    },
                    inApps: {
                        enable: true
                    }
                }]);
                this.PW.push(['onReady', () => {
                    this.props.mockInboxMessages();
                }]);
                if (!this.PW.pwinbox) {
                    return;
                }
                this.PW.push(['onPutNewMessageToInboxStore', () => {
                    this.updateInboxMessages();
                }]);
                this.PW.push(['onUpdateInboxMessages', () => {
                    this.updateInboxMessages();
                }]);

                this.PW.push(['onPermissionPrompt', this.onChangePermission]);
                this.PW.push(['onPermissionGranted', this.onChangePermission]);
                this.PW.push(['onPermissionDenied', this.onChangePermission]);
            }
        }

        onChangePermission() {
            this.props.changeSubscription(this.PW.driver.getPermission());
        }

        updateInboxMessages() {
            this.PW.pwinbox.loadMessages().then((messages) => {
                this.props.updateInboxMessages(messages);
            });
            this.PW.pwinbox.unreadMessagesCount().then((count) => {
                this.props.updateUnreadMessagesCount(count);
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
        setUserId: PropTypes.func.isRequired
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
        setUserId
    };

    return connect(mapStateToProps, bindActions)(CartTracking);
};


export default withCartTracking;
