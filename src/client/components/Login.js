import React from 'react';

export default class Login extends React.Component {
    state = {
        username: "",
        password: ""
    }

    handle_onchange_username = (e) => {
        this.setState({ username: e.target.value })
    };
    handle_onchange_password = (e) => {
        this.setState({ password: e.target.value })
    };

    handle_submit = (e) => {
        e.preventDefault();
        const { username: u, password: p } = this.state;
        console.log('submit');
        console.log(`${u},  ${p}`);
    };


    render() {
        return (
            <form  onSubmit={this.handle_submit}>
                <input type='text' placeholder='Username' onChange={this.handle_onchange_username} />
                <input type='text' placeholder='Password' onChange={this.handle_onchange_password} />
                <input type='submit' />
            </form>
        );
    }

    componentDidUpdate() {
        
    }

}