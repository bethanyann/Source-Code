import { createStore } from 'redux';

//createStore is a good example of a higher-order function bc it takes a function (reducer) as an argument

//then export the store so it can be used in the main application
export default function configureStore() {
    const store = createStore(reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
    );
    return store;
}