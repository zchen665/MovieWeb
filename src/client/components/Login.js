import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {
    state = {
        username: "",
        password: "",
        isAuthed: this.props.isAuthed,
        message: ""
    }

    handle_onchange_username = (e) => {
        this.setState({ username: e.target.value })
    };
    handle_onchange_password = (e) => {
        this.setState({ password: e.target.value })
    };

    handle_submit = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;

        try {
            const res = await fetch('/api/login_request', {
                method: 'POST',
                mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_name: username, pw: password })
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`); //exit when fail to retrieve
            }
            const { status, message } = await res.json();
            if (status == 1) { this.props.login_form_submit(status); }
            this.setState({
                message: message
            });


            // console.log("sent: ",JSON.stringify({ u_name: username, pw: password }));
            // console.log("response: ", data);
        } catch (err) {
            console.log("err: ", err.message);
        }
        console.log(`sumbit: ${username},  ${password}`);


    };


    render() {

        const { isAuthed, message } = this.state;
        ///////////////////////////////////////////////////////////
        // need to debug here
        if (isAuthed) { return <Redirect to='/user' /> }
        else {
            return (
                <div>
                    <form onSubmit={this.handle_submit} >
                        <input type='text' placeholder='Username' onChange={this.handle_onchange_username} />
                        <input type='text' placeholder='Password' onChange={this.handle_onchange_password} />
                        <input type='submit' />
                    </form>
                    <p>{message}</p>
                </div>
            );
        }
    }

}