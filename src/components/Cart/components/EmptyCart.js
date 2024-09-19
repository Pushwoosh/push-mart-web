import React from 'react';
import { Link } from 'react-router-dom';


const EmptyCart = () => (
    <div className="cart_empty text-center">
        <i className="glyphicon glyphicon-shopping-cart" />
        <p>No items in cart</p>
        <p className="lead">
            <Link to="/products">Explore</Link>
        </p>
        <hr />
    </div>
);

export default EmptyCart;
