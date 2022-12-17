import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadBugs } from '../store/bugs';

class Bugs extends Component {
    componentDidMount() {
        this.props.loadBugs();
    }

    
    render() {
        console.log(this.props.bugs);
        debugger;
        return (
            <ul>
                {this.props.bugs ?? this.props.bugs.map(bug => 
                    bug.forEach(b => {
                        (<li key={b.id}>{b.description} hey hi</li>)
                    })
                )}
            </ul>
        );
    }
}

// react-redux connect takes two arguments: one is a function that returns an object that says what piece of the store the component is interested in
// and the second argument is dispatching actions

// bugs: state.entities.bugs.list
const mapStateToProps = state => ({
    //what we set here will be passed to our component as a prop of the same name
    bugs: state.entities.bugs.list
});

//takes the dispatch func of store and maps it to the props of the component
const mapDispatchToProps = dispatch => ({
    //the properties of this object are going to be the props of the component
    loadBugs: () => dispatch(loadBugs())
});

// this is a Higher Order Function that returns a function, so after just call that function and pass in the Bugs component. 
// This creates a wrapper component around the Bugs that will take care of subscribing and unsubscribing from the store
export default connect(mapStateToProps, mapDispatchToProps)(Bugs);

