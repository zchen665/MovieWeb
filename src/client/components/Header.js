import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// class for Header//navigator 
//includes refresh_icon, title, and login link
class Header extends Component {
    redirect_login = ()=>{
        this.props.history.push('/login');
    };

    refresh_page= ()=>{
        this.props.history.push('/');
        window.location.reload();
    }

    render() {
        return (
            <div className='flex_container' id='header'>
                <div className='wrapper' id='refresh_icon_wrapper'>
                    <img
                        id="refresh_icon"
                        src={require('../Img/homeIcon.svg')}
                        alt="refresh icon"
                        onClick={this.refresh_page}
                        
                    />
                </div>
                <h1 className='wrapper' id='web_title'>MovieApp</h1>
                <div className='wrapper' id='login_wrapper' onClick={this.redirect_login}>
                    login
                </div>
            </div>
        );
    }
}
export default withRouter(Header);