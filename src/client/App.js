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
    movies: null, //stores search results in array of JSX Movie component
    loading: false,
    error_msg: null,
    cur_page: 1,
    total_page: null,
    display_movie_page: false, //controls the display of a detailed report on one movie 
    target_movie_info: null, //the info of the detailed movie display
    isAuthed: false, //authentication will not impact much of this component.
    username: null
  };

  //get value from search bar text field
  handle_textChange = (text) => {
    this.setState({ search_val: text });
  };


  // get_movie_page = async () => {

  //   const movie_id = this.props.match.params.movie_id;
  //   if (movie_id == undefined) return <p>{""}</p>;

  //   console.log("inside get_movie_page. movie_id is: ", movie_id);
  //   await this.handle_movie_select(movie_id);
  //   return <MoviePage movie_info={target_movie_info} />
  // }



  //process data from search result.
  handle_data = (data) => {
    const { Response, Search, Error, totalResults } = data;
    if (Error) {
      this.setState({ error_msg: Error });
      return;
    } else {
      //generate retrieved movies jsx
      const returned_movies = (Response && !Error) ?
        Search.map((movie, i) => {
          const { Title, Year, Poster, imdbID } = movie;
          const movie_id = `movie${i}`;
          return <Movie key={movie_id} id={imdbID} title={Title} year={Year} poster={Poster} />
        }) : null;

      this.setState({
        movies: returned_movies,
        error_msg: null,
        total_page: Math.ceil(totalResults / 10), //retrieve 10 movies per search 
      });
      //clear Error Warning (from previous api access)
    }
  };

  //when search btn clicked search with search_val 
  //access api using fetch 
  handle_submit = (page = null, val = null) => {
    const { cur_page, search_val } = page && val ? { page, val } : this.state;

    // //start accessing/loading api
    // this.setState({ loading: true, cur_page: cur_page, search_val: search_val });
    // fetch(`http://www.omdbapi.com/?s=${search_val}&page=${cur_page}&apikey=5d37056f`)
    //   .then(res => {
    //     if (!res.ok) {//handle http failures
    //       throw new Error(`HTTP error! status: ${res.status}`);
    //     } else {
    //       return res.json();
    //     }
    //   })
    //   .then(this.handle_data)
    //   .catch(error => {//also takes care of internet errors
    //     this.setState({ error_msg: error.message + ", Check Internet connection" });
    //   })
    //   .finally(() => {
    //     this.setState({
    //       loading: false,
    //       display_movie_page: false,
    //     });

    //     //directs to new page
    this.props.history.push(`/search=${search_val}/page=${cur_page}`);
    // });
  };

  //handle page change request( nextpage etc.)
  //async func due to asynchronous nature of setstate
  handle_page_change = async (page) => {
    const { cur_page } = this.state;
    const next_page = page === "Next" ? cur_page + 1 :
      page === "Prev" ? cur_page - 1 : page;
    await this.setState({ cur_page: next_page });
    this.handle_submit();
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
    const { username, target_movie_info, display_movie_page, loading, error_msg, movies, cur_page, total_page, isAuthed } = this.state;
    return (
      // <BrowserRouter>
      <div>
        <Header isAuthed={isAuthed} username={username} />
        <Switch>
          <Route exact path='/login'><Login login_request={this.handle_log_inout} /> </Route>
          <Route exact path='/sign_up'><SignUp login_request={this.handle_log_inout} /></Route>
          <Route path={'/' || '/search=:search_val/'}>
            <div className="flex_container_col">
              <div id="web_content">
                <Search textchange={this.handle_textChange} onsearch={this.handle_submit} />

                <Route exact path='/movie_id=:movie_id'><MoviePage /></Route>
                <Route exact path='/search=:search_val/page=:cur_page'><SearchResult /></Route>

              </div>
            </div>
          </Route >


          <PrivateRoute exact path='/user' component={UserPage} logout_request={this.handle_log_inout} />
        </Switch>
      </div>
      // </BrowserRouter>

    );
  }
}
export default withRouter(App);
