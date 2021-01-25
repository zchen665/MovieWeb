import React from 'react';
import { Redirect } from 'react-router-dom';

//instance of HOC higher-order-component

//provide a wrapper around passed in child component, make it 
//only accessible if authorized/ logged in 
class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        const session = sessionStorage.getItem('token');
        let token;
        if (session) {
            token = JSON.parse(session);
        }
        this.state = {
            Component: this.props.component,
            isAuthed: token? token.isAuthed: false,
            username: token? token.username: "",
        }
    }

    // componentDidUpdate() {
    //     const session = sessionStorage.getItem('token');
    //     if (session) {
    //         const token = JSON.parse(session);
    //         this.setState(token);
    //     }
    // }

    render() {

        const { isAuthed, Component, username } = this.state;
        // console.log(isAuthed);
        if (isAuthed != true) {
            return <Redirect to={`/login`} />
        } else {
            return <Component {...this.props} username={username}> </Component>
        }
    }

}

export { PrivateRoute };
