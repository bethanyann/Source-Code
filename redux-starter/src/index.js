import configureStore from './store/configureStore';
import { bugAdded, bugResolved, bugAssignedToUser, getUnresolvedBugs, getUnresolvedBugsMemo } from './store/bugs';
import { projectAdded } from './store/projects';
import { userAdded } from './store/users';


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

store.dispatch(userAdded("User 1"));
store.dispatch(userAdded("User 2"));

store.dispatch(bugAssignedToUser({ bugId: 1, userId: 1}));

store.dispatch(projectAdded({name: "Project 1"}));

const unresolvedBugs = getUnresolvedBugs(store.getState());
const unresolvedBugsAgain = getUnresolvedBugs(store.getState());

//this returns false because these reference two different objects
console.log(unresolvedBugs === unresolvedBugsAgain); 

const unresolvedBugsMemoed = getUnresolvedBugsMemo(store.getState());
const unresolvedBugsMemoedAgain = getUnresolvedBugsMemo(store.getState());

//this returns true because the bug data didn't change, therefore it pulled the second one from the cache
console.log(unresolvedBugsMemoed === unresolvedBugsMemoedAgain); 

console.log(store);

// store.dispatch({
//     type: actions.BUG_RESOLVED,
//     payload: {
//         id: 1
//     }
// });


console.log(store);

