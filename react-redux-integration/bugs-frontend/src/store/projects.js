import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;
//this function accepts a 'slice name', an initial state, and an object full of reducer functions
//and then generates action types and action creators that correspond to the reducers and state
const slice = createSlice({
    name:'projects', //give the slice a name
    initialState: [],
    reducers: {
        //action => action handler
        projectAdded: (state, action) => {
            //add a new project to array of projects
            state.push({
                id: ++lastId,
                name: action.payload.name
            })
        }
    }
});

//the reducer has to be a default export
export default slice.reducer;
//the actions are named exports
export const { projectAdded } = slice.actions;