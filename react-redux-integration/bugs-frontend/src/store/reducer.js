import { combineReducers } from 'redux';
import entitiesReducer from './entities';

//this redux function combines slices of our store into one reducer function
export default combineReducers({
    entities: entitiesReducer,
});