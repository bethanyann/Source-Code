
//define specific types of actions that deal with api calls
const api = store => next => action => {
   if(action.type !== 'apiCallBegan') {
    //if action does not match, pass it to the next one in the line
    next(action);
    return;
   }
};

const action = {
    type: 'apiCallBegan',
    payload: {
        url: '/bugs',
        method: 'get',
        data: {},
        onSuccess: 'bugsReceived', // using strings, not passing functions as callbacks because this action should be serializable
        onError: 'apiRequestFailed' // functions are not serializable
    }
}

export default api;