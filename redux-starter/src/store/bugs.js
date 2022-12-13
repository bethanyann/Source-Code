import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';
import moment from 'moment'
let lastId = 0;

const slice = createSlice({
    name: "bugs",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null  //this is useful for caching 
    },
    reducers: {
        bugAssignedToUser: (bugs, action) => {
            const { bugId, userId } = action.payload;
            const index = bugs.list.findIndex(bug => bug.id === bugId);
            if(index !== -1) bugs.list[index].userId = userId;
        },
        bugAdded: (bugs, action) => {
            bugs.list.push(action.payload);
        },
        bugResolved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
            if(index !== -1)  bugs.list[index].resolved = true;
        },
        bugsReceived: (bugs, action) => {
            bugs.list = action.payload;
            bugs.loading = false;
            //to keep track of caching
            bugs.lastFetch = Date.now();
        },
        bugsRequested: (bugs, action) => {
            //this reducer and action are for when the bugs are being fetched, to display a spinner to the user 
            bugs.loading = true;
        },
        bugsRequestFailed: (bugs, action) => {
            bugs.loading = false;
        }
    }
});

export const {
    bugAssignedToUser,
    bugAdded,
    bugResolved,
    bugsReceived,
    bugsRequested,
    bugsRequestFailed
} = slice.actions;
export default slice.reducer;

//URL consts should probably go in a constants file somewhere
const bugsUrl = "/bugs";

//Action Creators
//rewriting the implementation to return a function so that we can access the state and get the lastFetch data
export const loadBugs = () => (dispatch, getState) => {
    debugger;
    const { lastFetch } = getState().entities.bugs;

    const timeDiffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    console.log(timeDiffInMinutes);

    if(timeDiffInMinutes < 10 ) return;
    //this returns an action object but we need to explicitly dispatch this action 
    dispatch(apiCallBegan({
        url: bugsUrl,
        onStart: bugsRequested.type,
        onSuccess: bugsReceived.type, //can also write this like slice.actions.bugsReceived.type if you don't want to do object destructuring above
        onError: bugsRequestFailed.type
    }));

}

// export const loadBugs = () => apiCallBegan({
//     url: bugsUrl,
//     onStart: bugsRequested.type,
//     onSuccess: bugsReceived.type, //can also write this like slice.actions.bugsReceived.type if you don't want to do object destructuring above
//     onError: bugsRequestFailed.type
//});



// Redux Toolkit Reducer - the first argument is the initial state, the second argument is a function that maps actions to functions that handle the actions
// export default createReducer([], { 
//     // key: name of the action
//     // actions: functions --> kind of like an event being mapped to an event handler
//     [bugAdded.type]: (state, action) => {
//         //write mutating code here - what changes when this action happens
//         state.push({
//             id: ++lastId,
//             description: action.payload.description,
//             resolved: false
//         });
//     },
//     [bugResolved.type]: (state, action) => {
//        const index = state.findIndex(bug => bug.id === action.payload.id);
//        state[index].resolved = true;
//     },
//     [bugRemoved.type]: (state, action) => {
//         state.filter(bug => bug.id !== action.payload.id);
//     },
//     [bugAssignedToUser.type]: (state, action) => {
//         //need the bug and user here in the payload
//         const { bugId, userId } = action.payload;
//         //look up bug with this id and set it's user id to the user
//         const index = state.findIndex(bug => bug.id === bugId);
//         state[index].userId = userId;
//     }

// });


export const getBugsByUser = userId =>
  createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.userId === userId)
  );

export const getUnresolvedBugs = createSelector(
  state => state.entities.bugs,
  state => state.entities.projects,
  (bugs, projects) => bugs.list.filter(bug => !bug.resolved)
);
