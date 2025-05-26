import * as constants from '../constants';

function changeWishList(payload) {
  return {
    type: constants.WISHLIST_CHANGE,
    payload,
  };
}

export default changeWishList;
