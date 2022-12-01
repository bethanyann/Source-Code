
import { createAction, createReducer } from "@reduxjs/toolkit";

// ACTION TYPES
// store all of the different action type strings in one place to reduce code duplication 
// These are no longer needed with the addition of Redux Toolkit
// const BUG_ADDED = "BUG_ADDED";
// const BUG_REMOVED = "BUG_REMOVED";
// const BUG_RESOLVED = "BUG_RESOLVED";

// ACTION CREATORS
//Redux Toolkit way of writing Action Creators
export const bugAdded = createAction("bugAdded");
export const bugResolved = createAction("bugResolved");
export const bugRemoved = createAction("bugRemoved");

//now you can go bugAdded.type and get the action type from that, so the constants defined above are no longer needed

// export const bugAdded = description => ({
//     type: BUG_ADDED,
//     payload: {
//         description: description
//     }
// });
// export const bugResolved = id => ({
//     type: BUG_RESOLVED,
//     payload: {
//         id: id
//     }
// });
// action creator as not an arrow function
// export function bugAdded(description) {
//     //dispatch an action 
//     return {
//         type: actions.BUG_ADDED,
//         payload: {
//             description: description
//         }
//      }
//};

// REDUCERS

let lastId = 0;

// Redux Toolkit Reducer - the first argument is the initial state, the second argument is a function that maps actions to functions that handle the actions
export default createReducer([], { 
    // key: name of the action
    // actions: functions --> kind of like an event being mapped to an event handler
    [bugAdded.type]: (state, action) => {
        //write mutating code here - what changes when this action happens
        state.push({
            id: ++lastId,
            description: action.payload.description,
            resolved: false
        });
    },
    [bugResolved.type]: (state, action) => {
       const index = state.findIndex(bug => bug.id === action.payload.id);
       state[index].resolved = true;
    },
    [bugRemoved.type]: (state, action) => {
        state.filter(bug => bug.id !== action.payload.id)
    }
})
//on first load, state will be undefined as nothing has been set yet.
//to prevent application from blowing up, set state = [] to represent the initial state

// export default function reducer(state = [], action) {
//     //can also implement this logic with a switch/case structure
//     if(action.type === bugAdded.type) {
//         //return array of new bug object
//         return [
//             ...state,
//             {
//                 description: action.payload.description,
//                 resolved: false,
//                 id: ++lastId
//             }
//         ]
//     } 
//     else if(action.type === bugRemoved.type) {
//         return state.filter(bug => bug.id !== action.payload.id)
//     }
//     else if(action.type === bugResolved.type) {
//         return state.map(bug => 
//             bug.id == action.payload.id ? {...bug, resolved: true} : bug  //if the bug id matches, return a new object by copying the bug and then setting the resolved property to true
//         )
//     }
//     //very important to return the current state if there is an action type that isn't handled, so that the application 
//     //doesnt blow up
//     else return state;
// }
