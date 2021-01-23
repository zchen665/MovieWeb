import React from 'react';
import { Redirect } from 'react-router-dom';
import { UserPage } from './UserPage.js';
class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            component: this.props.component,
            isAuthenticated: this.props.isAuthenticated,
            loading: this.props.loading
        }
    }

    render() {

        const { isAuthenticated, loading, component} = this.state;
        if (loading) {
            return <h3>loading...Please wait!</h3>
        }
        if (!isAuthenticated) {
            return <Redirect to="/login" />
        }
        return <component {...this.props}></component>
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