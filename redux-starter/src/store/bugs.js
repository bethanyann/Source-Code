
// ACTION TYPES
// store all of the different action type strings in one place to reduce code duplication 
const BUG_ADDED = "BUG_ADDED";
const BUG_REMOVED = "BUG_REMOVED";
const BUG_RESOLVED = "BUG_RESOLVED";

// ACTION CREATORS

export const bugAdded = description => ({
    type: BUG_ADDED,
    payload: {
        description: description
    }
});

export const bugResolved = id => ({
    type: BUG_RESOLVED,
    payload: {
        id: id
    }
});

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

//on first load, state will be undefined as nothing has been set yet.
//to prevent application from blowing up, set state = [] to represent the initial state

export default function reducer(state = [], action) {
    //can also implement this logic with a switch/case structure
    if(action.type === BUG_ADDED) {
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
    else if(action.type === BUG_REMOVED) {
        return state.filter(bug => bug.id !== action.payload.id)
    }
    else if(action.type === BUG_RESOLVED) {
        debugger;
        return state.map(bug => 
            bug.id == action.payload.id ? {...bug, resolved: true} : bug  //if the bug id matches, return a new object by copying the bug and then setting the resolved property to true
        )
    }
    //very important to return the current state if there is an action type that isn't handled, so that the application 
    //doesnt blow up
    else return state;
}
