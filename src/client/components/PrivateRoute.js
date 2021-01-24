import React from 'react';
import { Redirect } from 'react-router-dom';
import { UserPage } from './UserPage.js';
class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Component: this.props.component,
            isAuthenticated: this.props.isAuthed,
            loading: this.props.loading
        }
    }

    render() {
        
        const { isAuthenticated, loading, Component} = this.state;
        console.log(isAuthenticated);
        if (loading == true) {
            return <h3>loading...Please wait!</h3>
        }
        if (isAuthenticated!=="true") {
            return <Redirect to="/login" />
        }
        return <Component {...this.props}> </Component>
    }

}

export { PrivateRoute };

//function component version:
// const PrivateRoute = ({component: Component, isAuthenticated, isLoading, ...rest }) => { 
//     if(isLoading) {
//         return <div>Loading...</div>
//     }
//     if(!isAuthenticated) {
//         return <Redirect to="/login" />
//     }
//     return <Component {...this.props} /> 
//  }
// } 
// } 

// export { PrivateRoute };