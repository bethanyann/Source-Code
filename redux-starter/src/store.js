import { createStore } from 'redux';
import reducer from './reducer';

//createStore is a good example of a higher-order function bc it takes a function (reducer) as an argument
createStore(reducer);
