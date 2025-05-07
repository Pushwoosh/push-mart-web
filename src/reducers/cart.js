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

    [constants.CART_REMOVE_PRODUCT]: (state, name) => state.filter(item => item.name !== name),

    [constants.CART_PRODUCT_QUANTITY]: (state, { productName, enlarge }) => {
        const product = find(state, { name: productName }) || {};
        product.quantity = enlarge ? product.quantity + 1 : product.quantity - 1;

        return uniq([...state, product]);
    },

    [constants.CART_CLEAR]: () => initialState,
};

export default function cart(state = initialState, action = {}) {
    if (reducers[action.type]) {
        return reducers[action.type](state, action.payload);
    }
    return state;
}
