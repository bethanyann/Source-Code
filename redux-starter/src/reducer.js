
const bugAdded = "BUG_ADD";
const bugRemoved = "BUG_REMOVED";

let lastId = 0;

//on first load, state will be undefined as nothing has been set yet.
//to prevent application from blowing up, set state = [] to represent the initial state

export default function reducer(state = [], action) {
    //can also implement this logic with a switch/case structure
    if(action.type === bugAdded) {
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
    else if(action.type === bugRemoved) {
        return state.filter(bug => bug.id !== action.payload.id)
    }
    //very important to return the current state if there is an action type that isn't handled, so that the application 
    //doesnt blow up
    else return state;
}