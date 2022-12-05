import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';

// ACTION CREATORS
//Redux Toolkit way of writing Action Creators
export const bugAdded = createAction("bugAdded");
export const bugResolved = createAction("bugResolved");
export const bugRemoved = createAction("bugRemoved");
export const bugAssignedToUser = createAction("bugAssignedToUser");
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
        state.filter(bug => bug.id !== action.payload.id);
    },
    [bugAssignedToUser.type]: (state, action) => {
        //need the bug and user here in the payload
        const { bugId, userId } = action.payload;
        //look up bug with this id and set it's user id to the user
        const index = state.findIndex(bug => bug.id === bugId);
        state[index].userId = userId;
    }

});


//Memoization
export const getUnresolvedBugs = (state) => {
    state.entities.bugs.filter(bug => !bug.resolved);
}

//here's a way to memoize the unresolvedBugs with reselect's createSelector
export const getUnresolvedBugsMemo = createSelector(
    state => state.entities.bugs,
    bugs => bugs.filter(bug => !bug.resolved) //if this list of bugs does not change, this logic will not be executed again
)

export const getBugsByUser = (userId) => createSelector(
    state => state.entities.bugs, //takes in state, returns state.entities.bugs
    //the output of the function is the input of the result function
    bugs => bugs.filter(bug => bug.userId === userId)
);