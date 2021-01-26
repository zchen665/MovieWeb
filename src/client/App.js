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

class App extends Component {
  state = {
    search_val: "",
    isAuthed: false, //authentication will not impact much of this component.
    username: null,
    cur_page: 1
  };

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
      console.log("logged in in app.js");
    }
    else if (isAuthed && status == -1) {
      this.setState({ isAuthed: false });
      console.log("logged out in app.js");
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
    const { username, isAuthed } = this.state;
    return (
      <div>
        <Header isAuthed={isAuthed} username={username} />
        <Switch>
          <PrivateRoute exact path='/user' component={UserPage} logout_request={this.handle_log_inout} />
          <Route exact path='/login'><Login login_request={this.handle_log_inout} /> </Route>
          <Route exact path='/sign_up'><SignUp login_request={this.handle_log_inout} /></Route>
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
