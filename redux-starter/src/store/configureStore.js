// import { createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './projects';

//createStore is a good example of a higher-order function bc it takes a function (reducer) as an argument

//then export the store so it can be used in the main application
export default function createStore() {
    // const store = createStore(reducer,
    //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
    // );

    //create the redux toolkit store and pass it a configuration object 
    const store = configureStore({
        reducer: reducer
    });
    return store;
}