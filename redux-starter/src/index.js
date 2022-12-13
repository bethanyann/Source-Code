import configureStore from './store/configureStore';
import { bugAdded, bugResolved, bugAssignedToUser, getUnresolvedBugs, getUnresolvedBugsMemo, getBugsByUser } from './store/bugs';
import { projectAdded } from './store/projects';
import { userAdded } from './store/users';
// import * as actions from './store/api';
import { loadBugs } from './store/bugs';
import { addBug } from './store/bugs';

const store = configureStore();

//this code below isn't great to have in the UI layer as it contains too much business logic and also will need duplicated around the site
// store.dispatch(actions.apiCallBegan({
//     url: '/bugs',
//     onSuccess: 'bugs/bugsReceived', // using strings, not passing functions as callbacks because this action should be serializable
// }));

//better to write something like this in the UI layer:
//simply dispatch this action and our UI becomes hydrated from the data on the server.
//very simple and also reusable
store.dispatch(loadBugs());

store.dispatch(addBug({ description: "a" }));
//dispatch loadBugs() again after 2 seconds
setTimeout(() => {store.dispatch(loadBugs())}, 4000);

// subscribe to the store
// this function returns a method for unsubscribing to the store 
const unsubscribe = store.subscribe(() => {
    // this gets called anytime there are changes to the state in the store
    // this is where the UI will subscribe to the store so that the UI gets notified when the state changes
    // and can update
    console.log("Store changed!");
});

console.log(store);

