/* eslint react/no-array-index-key: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Item from './components/Item';
import Promo from '../Promo/Promo';
import RegisterUser from '../RegisterUser/RegisterUser';
import './List.css';
import catalog from '../../data/products';


const ProductList = ({ isSubscribed, subscribeHandler, userId, setUserId, registerUser, ...rest }) => {
    const { cartItems, wishList, ...handlers } = rest;

    return (
        <div>
            <div className="text-center websdk-facebook" />
            {
                !isSubscribed && 
                <>
                    <Promo
                        text="Be the first who know about new discounts we offer"
                        successText="Subscribe"
                        onSuccess={subscribeHandler}
                    />
                    <hr />
                </>
            }
            <RegisterUser
              userId={userId}
              setUserId={setUserId}
              registerUser={registerUser}
            />
            <hr />
            <div>
                {catalog.map(({ items, title }, key) => {
                    const shownItems = items.slice(0, 3);

                    return (
                        <div key={key}>
                            <h4 style={{ textTransform: 'uppercase' }}>{title}</h4>
                            <ul className="product-list">
                                {shownItems.map(item => (
                                    <Item
                                        key={item.id}
                                        item={item}
                                        isInWishList={wishList.indexOf(item.name) >= 0}
                                        isInCart={cartItems.some(cItem => cItem.name === item.name)}
                                        {...handlers}
                                    />
                                ))}
                            </ul>
                            <hr />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const cartItemShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameLocal: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    quantity: PropTypes.number,
}).isRequired;

ProductList.propTypes = {
    cartItems: PropTypes.arrayOf(cartItemShape).isRequired,
    wishList: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    addToCartHandler: PropTypes.func.isRequired,
    removeFromCartHandler: PropTypes.func.isRequired,
    changeWishListHandler: PropTypes.func.isRequired,
    subscribeHandler: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    setUserId: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
};


export default ProductList;
