import * as constants from '../constants';

const initialState = [];

const reducers = {
  [constants.WISHLIST_CHANGE]: (state, payload) => {
    if (!payload.checked) {
      return [...state, payload.name];
    }

    return state.filter((item) => item !== payload.name);
  },
};

export default function wish(state = initialState, action = {}) {
  if (reducers[action.type]) {
    return reducers[action.type](state, action.payload);
  }
  return state;
}
