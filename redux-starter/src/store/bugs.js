
import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";

// ACTION CREATORS
//Redux Toolkit way of writing Action Creators
export const bugAdded = createAction("bugAdded");
export const bugResolved = createAction("bugResolved");
export const bugRemoved = createAction("bugRemoved");

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
