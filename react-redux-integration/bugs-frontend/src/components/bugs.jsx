import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUnresolvedBugs, loadBugs, resolveBug } from '../store/bugs';

class Bugs extends Component {
    componentDidMount() {
        this.props.loadBugs();
    }

    render() {
        return (
             <ul>
                {this.props.bugs.map((bug) => (
                    <li key={bug.id}>
                        {bug.description}
                        <button onClick={() => this.props.resolveBug(bug.id)}>
                            Resolve
                        </button>
                    </li>
                ))}
            </ul> 
        );
    }
}

// react-redux connect takes two arguments: one is a function that returns an object that says what piece of the store the component is interested in
// and the second argument is dispatching actions

// bugs: state.entities.bugs.list
const mapStateToProps = state => ({
    //what we set here will be passed to our component as a prop of the same name
    bugs: getUnresolvedBugs(state)
});

//takes the dispatch func of store and maps it to the props of the component
const mapDispatchToProps = dispatch => ({
    //the properties of this object are going to be the props of the component
    loadBugs: () => dispatch(loadBugs()),
    resolveBug: id => dispatch(resolveBug(id))
});

// this is a Higher Order Function that returns a function, so after just call that function and pass in the Bugs component. 
// This creates a wrapper component around the Bugs that will take care of subscribing and unsubscribing from the store
export default connect(mapStateToProps, mapDispatchToProps)(Bugs);

