import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';
import moment from 'moment';
import axios from "axios";


const slice = createSlice({
    name: "bugs",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null  //this is useful for caching 
    },
    reducers: {
        bugAssignedToUser: (bugs, action) => {
            const { id: bugId, userId } = action.payload;
            const index = bugs.list.findIndex(bug => bug.id === bugId);
            if(index !== -1) bugs.list[index].userId = userId;
        },
        //redux devtools automatically creates an action for us called bugAdded
        // command = addBug - event = bugAdded
        // a command is an instruction into the system and represents what needs to be done, an event represents what just happened
        // this is related to CQRS
        bugAdded: (bugs, action) => {
            bugs.list.push(action.payload);
        },
        // resolveBug = command - bugResolved = event
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

//these don't need exported because they're only used internally and shouldn't be able to be accessed outside of this slice
 const {
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
    return dispatch(apiCallBegan({
        url: bugsUrl,
        onStart: bugsRequested.type,
        onSuccess: bugsReceived.type, //can also write this like slice.actions.bugsReceived.type if you don't want to do object destructuring above
        onError: bugsRequestFailed.type
    }));
}
//test action creator to make sure the tests didn't break 
// export const addBug = bug => async dispatch => {
//     const response = await axios.request({
//         baseURL: 'http://localhost:9001/api',
//         url: '/bugs',
//         method: 'post',
//         data: bug
//     });
//     dispatch(bugAdded(response.data));
// }

//New action creator here for saving data to the server
export const addBug = bug => apiCallBegan({
    url: bugsUrl,
    method: "post",
    data: bug, //this bug object will be included in the body of the request
    onSuccess: bugAdded.type
});

export const assignBugToUser = (bugId, userId) => apiCallBegan({
    url: bugsUrl + '/' + bugId,
    method: 'patch',
    data: { userId },
    onSuccess: bugAssignedToUser.type
});

//New action creator here for resolving bugs
export const resolveBug = id => apiCallBegan({
    //PATCH /bugs/{bugId}
    url: bugsUrl + '/' + id,
    method: 'patch',
    data: { resolved: true}, //include this in the body of the request
    onSuccess: bugResolved.type
});

export const getBugsByUser = userId =>
  createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.userId === userId)
  );

//selectors might seem confusing but they are just functions that take in state and return
//a list of unresolved bugs
//state => unresolvedBugs
export const getUnresolvedBugs = createSelector(
  state => state.entities.bugs,
  state => state.entities.projects,
  (bugs, projects) => bugs.list.filter(bug => !bug.resolved)
);


