
import axios from 'axios';
import { bindActionCreators } from 'redux';
import * as actions from '../api';


//define specific types of actions that deal with api calls
const api = store => next => async action => {
    if(action.type !== actions.apiCallBegan.type) {
        //if action does not match, pass it to the next one in the line
       next(action);
       return;
    }
    //get the props from the payload of the action
    const {  url, method, data, onSuccess, onError, onStart } = action.payload;
  
    //only dispatch this action if onStart is defined
    if(onStart) {
       store.dispatch({ type: onStart });
    }
    
    //run the apiCallBegan after the onStart has been dispatched
    next(action);

    try {
        const response = await axios.request({ 
            baseURL: 'http://localhost:9001/api',
            url,  //the url of the endpoint like /bugs
            method,
            data 
        });
        //if success, dispatch an action
        //General success dispatch
        store.dispatch(actions.apiCallSuccess(response.data));
        //Specfic success dispatch
        if(onSuccess)
            store.dispatch({ type: onSuccess, payload: response.data });
    } catch(error) {
        //if error, dispatch an error action
        //General error dispatch
        console.log(error.message);
        store.dispatch(actions.apiCallFailed(error.message));
        //Specfic error dispatch
        if(onError)
            store.dispatch({ type: onError, payload: error.message });
    }
    
};



export default api;