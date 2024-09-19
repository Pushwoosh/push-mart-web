import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Promo from '../Promo/Promo';
import { CartItem, EmptyCart } from './components';
import './Cart.css';


const modalStyle = {
    overlay: {
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, .5)',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        boxShadow: '0 0 10px #333',
    },
};

const Cart = (props) => {
    const {
        isSubscribed,
        cartItems,
        total,
        showModal,
        ...handlers
    } = props;
    const { openModalHandler, closeModalHandler, changeQuantityHandler } = handlers;

    return (
        <div className="cart">
            {cartItems.length > 0 ? (
                <div>
                    {cartItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            changeQuantityHandler={changeQuantityHandler}
                        />
                    ))}
                    <div className="cart__total">Total: {total} $</div>
                    <hr />
                    <button
                        className="btn btn-default pull-right btn_checkout btn-primary"
                        onClick={openModalHandler}
                    >
                        Checkout
                    </button>
                </div>
            ) : <EmptyCart />}

            <Modal
                isOpen={showModal}
                onRequestClose={closeModalHandler}
                style={modalStyle}
                contentLabel="Success"
            >
                <span className="close-modal" onClick={closeModalHandler}>&times;</span>
                <h4>Success! Your order is being processed.</h4>
                {!isSubscribed && <Promo
                    text="Would you like to receive notifications with special offers?"
                    onSuccess={() => closeModalHandler(true)}
                    onReject={() => closeModalHandler(false)}
                />}
            </Modal>
        </div>
    );
};

Cart.propTypes = {
    cartItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        nameLocal: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        quantity: PropTypes.number,
    }).isRequired).isRequired,
    total: PropTypes.string.isRequired,
    showModal: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    openModalHandler: PropTypes.func.isRequired,
    closeModalHandler: PropTypes.func.isRequired,
    changeQuantityHandler: PropTypes.func.isRequired
};

export default Cart;
