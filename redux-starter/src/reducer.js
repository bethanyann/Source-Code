import * as actions from "./actionTypes";


let lastId = 0;

//on first load, state will be undefined as nothing has been set yet.
//to prevent application from blowing up, set state = [] to represent the initial state

export default function reducer(state = [], action) {
    //can also implement this logic with a switch/case structure
    if(action.type === actions.BUG_ADDED) {
        //return array of new bug object
        return [
            ...state,
            {
                description: action.payload.description,
                resolved: false,
                id: ++lastId
            }
        ]
    } 
    else if(action.type === actions.BUG_REMOVED) {
        return state.filter(bug => bug.id !== action.payload.id)
    }
    else if(action.type === actions.BUG_RESOLVED) {
        debugger;
        return state.map(bug => 
            bug.id == action.payload.id ? {...bug, resolved: true} : bug  //if the bug id matches, return a new object by coping the bug and then setting the resolved property to true
        )
    }
    //very important to return the current state if there is an action type that isn't handled, so that the application 
    //doesnt blow up
    else return state;
}