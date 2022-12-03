import { combineReducers } from 'redux';
import bugsReducer from './bugs';
import projectsReducer from './projects';
import usersReducer from './users';

//this redux function combines slices of our store into one reducer function
export default combineReducers({
    //specify the slices of the store
    bugs: bugsReducer,
    projects: projectsReducer,
    users: usersReducer,
});