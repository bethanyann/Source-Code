import { createStore } from 'redux';
import reducer from './reducer';

//createStore is a good example of a higher-order function bc it takes a function (reducer) as an argument
const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
);

//then export the store so it can be used in the main application
export default store;