import React, { Component } from 'react';
import Header from './components/Header.js';
import { Search } from './components/Search.js';
import Movie from './components/Movie.js';
import MoviePage from './components/MoviePage.js';
import { BrowserRouter, IndexRoute, Route, Switch, withRouter } from 'react-router-dom';
import UserPage from './components/UserPage.js';
import { PrivateRoute } from './components/PrivateRoute.js'
import Login from './components/Login.js';
import SignUp from './components/SignUp.js';
import SearchResult from './components/SearchResult.js'

const IMG_URL = 'https://thumbnails.moviemania.io/phone/movie/129/54091e/670x1192.jpg'

class App extends Component {
  state = {
    search_val: "",
    isAuthed: false, //authentication will not impact much of this component.
    username: null,
    cur_page: 1,
    show_background: false
  };

  //toggles back ground
  handle_background = (bool) => {
    const path = window.location.pathname;
    //unmount of either Login or SignUp component is triggered later
    //this will block the toggling in navigation from Login to Signup or
    //vice versa 
    if ((path == '/sign_up' || path == '/login') && !bool) return;
    this.setState({ show_background: bool });
  }

  //get value from search bar text field
  handle_textChange = (text) => {
    this.setState({ search_val: text });
  };

  //when search btn clicked search with search_val 
  //update url and jump to SearchResult page
  handle_submit = (page = null, val = null) => {
    const { cur_page, search_val } = page && val ? { page, val } : this.state;
    this.props.history.push(`/search=${search_val}/page=${cur_page}`);
  };


  //handle both login and logout
  //if status == 1: login 
  // status == -1: logout 
  handle_log_inout = (status) => {
    const { isAuthed } = this.state;
    if (!isAuthed && status == 1) {
      this.setState({ isAuthed: true });
      console.log("logged in");
    }
    else if (isAuthed && status == -1) {
      this.setState({ isAuthed: false });
      console.log("logged out");
    }
  }


  //this will update the authentication token and then pass isAuthed state to
  //the Header component. therefore Header's isAuthed state directly inherits from
  // the App component.
  componentDidMount() {
    const session = sessionStorage.getItem('token');
    if (session) {
      const token = JSON.parse(session);
      this.setState(token);
    }
  }


  render() {
    const { username, isAuthed, show_background } = this.state;
    return (
      <div>
        {show_background && <img className="full_body_background" id='background' src={IMG_URL} />}
        <Header isAuthed={isAuthed} username={username} />
        <Switch>
          <PrivateRoute exact path='/user' component={UserPage} logout_request={this.handle_log_inout} />
          <Route exact path='/login'><Login login_request={this.handle_log_inout} change_background={this.handle_background} /> </Route>
          <Route exact path='/sign_up'><SignUp login_request={this.handle_log_inout} change_background={this.handle_background} /></Route>
          <Route path={'/' || '/search=:search_val/'}>
            <div className="flex_container_col">
              <Search textchange={this.handle_textChange} onsearch={this.handle_submit} />

              <Route exact path='/movie_id=:movie_id'><MoviePage isAuthed={isAuthed} username={username} /></Route>
              <Route exact path='/search=:search_val/page=:cur_page'><SearchResult /></Route>
            </div>
          </Route >

        </Switch>
      </div>
    );
  }
}
export default withRouter(App);
