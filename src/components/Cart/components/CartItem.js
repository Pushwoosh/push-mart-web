import React from 'react';
import PropTypes from 'prop-types';

function CartItem({ item, changeQuantityHandler }) {
  const {
    id,
    nameLocal,
    img,
    textLocal,
    quantity,
    price,
  } = item;
  const itemTotalPrice = (price * quantity).toFixed(2);

  return (
    <div className="media cart-item">
      <div className="media-left">
        <img className="media-object" src={`${img}.jpg`} alt="product" />
      </div>
      <div className="media-body">
        <div className="cart-item__info">
          <p>{nameLocal}</p>
          <p>{Array.isArray(textLocal) ? textLocal.join(' • ') : textLocal}</p>
        </div>
        <div className="cart-item__details">
          <span className="cart-item__price">
            {itemTotalPrice}
            {' '}
            $
          </span>
          <div className="input-group quantity">
            <button
              id="btn-plus"
              type="button"
              className="btn btn-default btn-primary"
              onClick={() => changeQuantityHandler(id, true)}
              aria-label="Increase quantity"
            >
              <span className="glyphicon glyphicon-plus" />
            </button>
            <input
              type="text"
              name="qty"
              id="qty"
              className="form-control"
              value={quantity}
              readOnly
            />
            <button
              id="btn-minus"
              type="button"
              className="btn btn-default btn-primary"
              onClick={() => changeQuantityHandler(id, false)}
              aria-label="Decrease quantity"
            >
              <span className="glyphicon glyphicon-minus" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameLocal: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    quantity: PropTypes.number,
  }).isRequired,
  changeQuantityHandler: PropTypes.func.isRequired,
};

export default CartItem;
