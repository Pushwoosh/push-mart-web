import * as constants from '../constants';

export function addToCart(payload) {
  return {
    type: constants.CART_ADD_PRODUCT,
    payload,
  };
}

export function removeFromCart(productId) {
  return {
    type: constants.CART_REMOVE_PRODUCT,
    payload: productId,
  };
}

export function changeProductQuantity(productId, enlarge) {
  return {
    type: constants.CART_PRODUCT_QUANTITY,
    payload: {
      productId,
      enlarge,
    },
  };
}

export function restoreCart(items) {
  return {
    type: constants.CART_RESTORE,
    payload: items,
  };
}

export function clearCart() {
  return {
    type: constants.CART_CLEAR,
  };
}
