import {
  APP_SAVE,
  APP_CLEAR,
  APP_SET_API_URL,
  CHANGE_SUBSCRIPTION,
  SET_USER_ID,
  USER_REGISTERED,
} from '../constants';

const initialState = {
  code: null,
  apiUrl: '',
  userId: '',
  registeredUserId: '',
  subscription: 'default',
};

// eslint-disable-next-line default-param-last
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case APP_SAVE: {
      return {
        ...state,
        code: action.payload,
      };
    }

    case APP_SET_API_URL: {
      return {
        ...state,
        apiUrl: action.payload,
      };
    }

    case APP_CLEAR: {
      return initialState;
    }

    case CHANGE_SUBSCRIPTION: {
      return {
        ...state,
        subscription: action.payload,
      };
    }

    case SET_USER_ID: {
      return {
        ...state,
        userId: action.payload,
      };
    }

    case USER_REGISTERED: {
      return {
        ...state,
        registeredUserId: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default appReducer;
