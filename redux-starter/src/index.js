import configureStore from './store/configureStore';
import { bugAdded, bugResolved } from './store/bugs';
import { projectAdded } from './store/projects';

const store = configureStore();
// subscribe to the store
// this function returns a method for unsubscribing to the store 
const unsubscribe = store.subscribe(() => {
    // this gets called anytime there are changes to the state in the store
    // this is where the UI will subscribe to the store so that the UI gets notified when the state changes
    // and can update
    console.log("Store changed!");
});

// easier way to dispatch an action is to call the action creator like this: 
// wrap the string value in an object with the description property for redux toolkit -- need to do it like this so the reducer doesn't break
store.dispatch(bugAdded({ description: "Bug 1" })); 
store.dispatch(bugAdded({ description: "Bug 2" }));
store.dispatch(bugAdded({ description: "Bug 3" }));
store.dispatch(bugResolved({ id: 1}));

store.dispatch(projectAdded({name: "Project 1"}));

console.log(store);

// store.dispatch({
//     type: actions.BUG_RESOLVED,
//     payload: {
//         id: 1
//     }
// });


console.log(store);

