import {
    APP_SAVE,
    APP_CLEAR,
    CHANGE_SUBSCRIPTION,
    SET_USER_ID
} from '../constants';

const initialState = {
    code: null,
    userId: '',
    subscription: 'default',
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case APP_SAVE: {
            return {
                ...state,
                code: action.payload,
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

        default: {
            return state;
        }
    }
};

export default appReducer;
