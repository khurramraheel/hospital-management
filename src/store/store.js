import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
// import adminReducer from './reducers/admin';

import auth from './reducers/auth';
import gigs from './reducers/gigs';

// import post from './reducers/postReducer';

const initialState = {};
const middelware = [thunk];

const store = createStore(
    combineReducers({auth, gigs}),
    initialState,
    applyMiddleware(...middelware));

export default store;
