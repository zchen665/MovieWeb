import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// class for Header//navigator 
//includes refresh_icon, title, and login link
class Header extends Component {
    state = {
        isAuthed: this.props.isAuthed,
        username: this.props.username,
    }
    redirect_login = () => {
        this.props.history.push('/login');
    };

    refresh_page = () => {
        this.props.history.push('/');
        window.location.reload();
    }

    redirect_user_page = () => {
        const { userName } = this.state;
        this.props.history.push(`/user`);
    }

    componentDidUpdate(prevState) {
        const session = sessionStorage.getItem('token');
        const { isAuthed: wasAuthed, ...rest } = prevState;
        // console.log(`componentdidupdate.wasAuthed: ${wasAuthed} and session: ${session}`);
        //will update username and display it.
        if (session && !wasAuthed) { //update header immediately after login 
            // console.log("this called");
            const token = JSON.parse(session);
            this.setState(token); //update both username and isAuth from token
        } else if (!session && wasAuthed) { //update header after log out
            this.setState({ isAuthed: false });
        }
    }
    componentDidMount() {
        const session = sessionStorage.getItem('token');
        if (session) {
            const token = JSON.parse(session);
            this.setState(token);
        }
    }

    render() {
        const { isAuthed, username } = this.state;
        return (
            <div className='flex_container' id='header'>
                <div className='wrapper' id='refresh_icon_wrapper'>
                    <img
                        id="refresh_icon"
                        src={require('../Img/homeIcon.png')}
                        alt="refresh icon"
                        onClick={this.refresh_page}
                    />
                </div>
                <h1 className='wrapper' id='web_title'>MovieApp</h1>
                {isAuthed ? <div className='wrapper' id="user_page_redirect_wrapper" onClick={this.redirect_user_page}>Hi, {username} </div> :
                    <div className='wrapper' id='login_wrapper' onClick={this.redirect_login}> login </div>}
            </div>
        );
    }
}
export default withRouter(Header);