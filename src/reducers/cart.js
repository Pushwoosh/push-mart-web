import find from 'lodash/find';
import uniq from 'lodash/uniq';
import * as constants from '../constants';

const initialState = [];

const reducers = {
  [constants.CART_ADD_PRODUCT]: (state, product) => uniq([
    ...state, {
      ...product,
      quantity: 1,
    },
  ]),

  [constants.CART_REMOVE_PRODUCT]: (state, id) => state.filter((item) => item.id !== id),

  [constants.CART_PRODUCT_QUANTITY]: (state, { productId, enlarge }) => {
    const product = find(state, { id: productId }) || {};
    product.quantity = enlarge ? product.quantity + 1 : product.quantity - 1;

    return uniq([...state, product]);
  },

  [constants.CART_CLEAR]: () => initialState,

  [constants.CART_RESTORE]: (state, items) => items,
};

export default function cart(state = initialState, action = {}) {
  if (reducers[action.type]) {
    return reducers[action.type](state, action.payload);
  }
  return state;
}
