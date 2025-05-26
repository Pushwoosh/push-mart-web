import { combineReducers, createStore } from 'redux';
import {
  appReducer, cartReducer, wishReducer, inboxReducer,
} from './reducers';

const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};

const rootReducer = combineReducers({
  app: appReducer,
  cart: cartReducer,
  wish: wishReducer,
  inbox: inboxReducer,
});

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable no-underscore-dangle */

store.subscribe(() => localStorage.setItem('reduxState', JSON.stringify(store.getState())));

export default store;
