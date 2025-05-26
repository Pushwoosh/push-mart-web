import React from 'react';
import PropTypes from 'prop-types';

function ProductItem(props) {
  const { item, isInWishList, isInCart } = props;
  const { addToCartHandler, removeFromCartHandler, changeWishListHandler } = props;
  const {
    name,
    nameLocal,
    img,
    price,
  } = item;
  const inputId = `wishlist-checkbox-${item.name}`;

  return (
    <li key={name} className="product-list__item">
      <h5>{nameLocal}</h5>
      <div className="product thumbnail">
        <img src={`${img}.jpg`} alt="product" />
        <div className="caption">
          <div className="product__price">
            $
            {price}
          </div>
          <div className="product__button-wrap">
            <button
              type="button"
              className="btn btn-primary"
              onClick={isInCart
                ? () => removeFromCartHandler(name)
                : () => addToCartHandler(item)}
            >
              {isInCart ? 'Remove from cart' : 'Add to cart'}
            </button>
            <div className="checkbox">
              <label htmlFor={inputId}>
                <input
                  id={inputId}
                  type="checkbox"
                  defaultChecked={isInWishList}
                  onChange={() => changeWishListHandler({
                    name,
                    checked: isInWishList,
                  })}
                />
                Add to wishlist
              </label>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

ProductItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameLocal: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    quantity: PropTypes.number,
  }).isRequired,
  isInWishList: PropTypes.bool.isRequired,
  isInCart: PropTypes.bool.isRequired,
  addToCartHandler: PropTypes.func.isRequired,
  removeFromCartHandler: PropTypes.func.isRequired,
  changeWishListHandler: PropTypes.func.isRequired,
};

export default ProductItem;
