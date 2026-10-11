import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { describe } from '../../data/catalog';
import './ProductPage.css';

function ProductPage({
  product, isInCart, addToCartHandler, removeFromCartHandler, hasAppCode,
}) {
  return (
    <div className="product-page media">
      <div className="media-left">
        <img className="media-object product-page__image" src={`${product.img}.jpg`} alt={product.nameLocal} />
      </div>
      <div className="media-body">
        <p className="product-page__category">{product.category}</p>
        <h3>{product.nameLocal}</h3>
        <p>{describe(product)}</p>
        <div className="product-page__price">
          $
          {product.price}
        </div>
        {hasAppCode ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={isInCart
              ? () => removeFromCartHandler(product.id)
              : () => addToCartHandler(product)}
          >
            {isInCart ? 'Remove from cart' : 'Add to cart'}
          </button>
        ) : (
          <Link className="btn btn-primary" to="/appcode">Enter Application Code to shop</Link>
        )}
      </div>
    </div>
  );
}

ProductPage.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nameLocal: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  }).isRequired,
  isInCart: PropTypes.bool.isRequired,
  hasAppCode: PropTypes.bool.isRequired,
  addToCartHandler: PropTypes.func.isRequired,
  removeFromCartHandler: PropTypes.func.isRequired,
};

export default ProductPage;
