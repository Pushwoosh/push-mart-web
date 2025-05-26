import * as constants from '../constants';

export function addToCart(payload) {
  return {
    type: constants.CART_ADD_PRODUCT,
    payload,
  };
}

export function removeFromCart(productName) {
  return {
    type: constants.CART_REMOVE_PRODUCT,
    payload: productName,
  };
}

export function changeProductQuantity(productName, enlarge) {
  return {
    type: constants.CART_PRODUCT_QUANTITY,
    payload: {
      productName,
      enlarge,
    },
  };
}

export function clearCart() {
  return {
    type: constants.CART_CLEAR,
  };
}
