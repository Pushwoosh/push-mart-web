import * as constants from '../constants';

export function saveApp(payload) {
  return {
    type: constants.APP_SAVE,
    payload,
  };
}

export function setApiUrl(payload) {
  return {
    type: constants.APP_SET_API_URL,
    payload,
  };
}

export function clearApp() {
  return {
    type: constants.APP_CLEAR,
  };
}

export function changeSubscription(payload) {
  return {
    type: constants.CHANGE_SUBSCRIPTION,
    payload,
  };
}

export function userRegistered(payload) {
  return {
    type: constants.USER_REGISTERED,
    payload,
  };
}

export function setUserId(payload) {
  return {
    type: constants.SET_USER_ID,
    payload,
  };
}
