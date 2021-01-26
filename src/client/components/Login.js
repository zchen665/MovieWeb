import React from 'react';
import { NavLink, Redirect, withRouter } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        let token;
        const session = sessionStorage.getItem('token');
        if (session) {
            token = JSON.parse(session);
        }
        this.state = {
            username: "", //for user text input.
            password: "",
            isAuthed: token ? token.isAuthed : false,
            message: ""
        }
    }

    handle_onchange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            message: ""
        })
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

            if (status == 1) { //login success
                const token = { username: username, isAuthed: true }
                sessionStorage.setItem('token', JSON.stringify(token));
                this.props.login_request(status);
                this.setState(token); //which causing redirects in componentDidUpdata();
            } else {
                this.setState({
                    message: message
                });
            }

            // console.log("sent: ",JSON.stringify({ u_name: username, pw: password }));
            // console.log("response: ", data);
        } catch (err) {
            console.log("err: ", err.message);
            this.setState({
                message: err.message
            });
        }
    };


    componentDidUpdate() {
        const { isAuthed } = this.state;
        if (isAuthed) this.props.history.goBack(); //redirect back to the page where the 
        //user tries to login
    }


    render() {
        const { message } = this.state;
        return (
            <div>
                <h2>Log in</h2>
                <form onSubmit={this.handle_submit} >
                    <input name='username' type='text' placeholder='Username' onChange={this.handle_onchange} />
                    <input name='password' type='password' placeholder='Password' onChange={this.handle_onchange} />
                    <input type='submit' />
                </form>
                <p>{message}</p>

                <NavLink to='/sign_up'>Sign up</NavLink>
            </div>
        );

    }

}

export default withRouter(Login);