import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';


//For learning purpose this component will be functional
const UserPage = (props) => {

    useEffect(() => {


    });

    const handle_log_out = (e) => {
        const status = -1; //-1 for logging out in app.js handle_log_inout handler
        e.preventDefault();
        console.log("clicked log out button");
        sessionStorage.removeItem('token');
        props.logout_request(status);
        props.history.push('/');
    };

    return (
        <div>
            <button onClick={handle_log_out}>Log out</button>
            <p>who's your daddy?</p>
        </div>
    );

}
export default withRouter(UserPage);