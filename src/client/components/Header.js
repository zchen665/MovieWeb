import React, { Component } from 'react';

// class for Header//navigator 
//includes refresh_icon, title, and login link
class Header extends Component {
    render() {
        return (
            <div className='flex_container' id='header'>
                <div className='wrapper' id='refresh_icon_wrapper'>
                    <img id="refresh_icon" src={require('../Img/homeIcon.svg')} alt="refresh icon" />
                </div>
                <h1 className='wrapper' id= 'web_title'>MovieApp</h1>
                <div className='wrapper' id='login_wrapper'>
                    login
                </div>
            </div>
        );
    }
}
export { Header };