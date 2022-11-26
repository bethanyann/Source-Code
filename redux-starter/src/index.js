import store from './store';
import { bugAdded, bugResolved } from './actions';

console.log(store.getState()); // this is [] when application is first loaded

//subscribe to the store
//this function returns a method for unsubscribing to the store 
const unsubscribe = store.subscribe(() => {
    //this gets called anytime there are changes to the state in the store
    //this is where the UI will subscribe to the store so that the UI gets notified when the state changes
    //and can update
});

//easier way to dispatch an action is to call the action creator like this: 
store.dispatch(bugAdded("Bug 1"));
store.dispatch(bugResolved(1));

console.log(store);

store.dispatch({
    type: actions.BUG_REMOVED,
    payload: {
        id: 1
    }
});


console.log(store);

