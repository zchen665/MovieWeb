import React from 'react';
import { NavLink, Redirect, withRouter } from 'react-router-dom';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        let token;
        const session = sessionStorage.getItem('token');
        if (session) {
            token = JSON.parse(session);
        }
        this.state = {
            isAuthed: token ? token.isAuthed : false, //get authentication first, if already
            //logged in(in session storage) then hide sign up form.
            message: "",
            username: "",
            password: "",
            pw_confirm: "",
            loading: false,
        }
    }

    handle_onchange = (e) => {
        const target_name = e.target.name;
        this.setState({
            [target_name]: e.target.value,
            message: ""
        });
    }

    handle_submit = async (e) => {
        e.preventDefault();
        const { password, username, pw_confirm } = this.state;
        console.log(`un: ${username}, pw: ${password}, pw2: ${pw_confirm}`);
        if (password !== pw_confirm) {
            this.setState({
                message: "Passwords must match."
            });
            return;
        }
        try {
            this.setState({ loading: true });
            const res = await fetch('/api/sign_up_request', {
                method: 'POST',
                // mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_name: username, pw: password })
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`); //exit when fail to retrieve
            }
            const { status, message } = await res.json();
            console.log(`status: ${status} and message: ${message}`)

            this.setState({ message: message, loading: false });
            if (status == 1) { //sign up success

                const token = { username: username, isAuthed: true }
                sessionStorage.setItem('token', JSON.stringify(token));
                this.props.login_request(status);

                //redirects to userpage in short time
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.setState({ message: 'Redirect to user page in 3s.' });
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.props.history.push('/user');
            }


            // console.log("sent: ", JSON.stringify({ u_name: username, pw: password }));
        } catch (err) {
            console.log("err: ", err.message);
            this.setState({
                message: err.message
            });
        }
    };

    render() {
        const { isAuthed, message, loading } = this.state;
        return (
            <div>
                <h2>Sign up</h2>
                {isAuthed ? <h3>Please Log out first.</h3> :
                    <div>
                        <form onSubmit={this.handle_submit} >
                            <label htmlFor="username">Name: </label>
                            <input name='username' type='text' placeholder='Username' onChange={this.handle_onchange} />
                            <input name='password' type='password' placeholder='Password' onChange={this.handle_onchange} />
                            <input name='pw_confirm' type='password' placeholder='Confirm Password' onChange={this.handle_onchange} />
                            <input type='submit' />
                        </form>
                        {loading ? <p>Processing your request...</p> : <p>{message}</p>}
                    </div>}
            </div>
        );

    }

}

export default withRouter(SignUp);