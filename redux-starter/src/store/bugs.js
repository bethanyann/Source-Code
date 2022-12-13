import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';
import moment from 'moment'


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
    //debugger;
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

//New action creator here for saving data to the server
export const addBug = bug => apiCallBegan({
    url: bugsUrl,
    method: "post",
    data: bug, //this bug object will be included in the body of the request
    onSuccess: bugAdded.type
});

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
