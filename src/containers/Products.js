import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, ProductList } from '../components';
import withCartTracking from '../HoC/withCartTracking';


class ProductsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            app: { subscription, userId },
            wish,
            cart,
            addToCart,
            removeFromCart,
            changeWishList,
            subscribe,
            setUserId,
            registerUser
        } = this.props;

        return (
            <Layout
                showCart
                showInbox
                showNavigation
                headerText="PushOn Online Shop"
                subscription={subscription}
            >

                <ProductList
                    wishList={wish}
                    cartItems={cart}
                    addToCartHandler={addToCart}
                    removeFromCartHandler={removeFromCart}
                    changeWishListHandler={changeWishList}
                    isSubscribed={subscription !== 'default'}
                    subscribeHandler={subscribe}
                    setUserId={setUserId}
                    registerUser={registerUser}
                    userId={userId}
                />
            </Layout>
        );
    }
}

ProductsContainer.propTypes = {
    app: PropTypes.shape({
        code: PropTypes.string.isRequired,
        subscription: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired
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
    subscribe: PropTypes.func.isRequired,
    setUserId: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired
};


export default withCartTracking(ProductsContainer);
