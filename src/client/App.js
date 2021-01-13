import React, { Component } from 'react';
import { Header } from './components/Header.js';
import { Search } from './components/Search.js';
import Movie from './components/Movie.js';
import { PageNav } from './components/PageNav.js';

export default class App extends Component {
  state = {
    search_val: "",
    movies: null,
    loading: false,
    error_msg: null,
    cur_page: 2,
    total_page: null,
  };

  handle_textChange = (text) => {
    this.setState({ search_val: text });
  };

  handle_data = (data) => {
    const { Response, Search, Error, totalResults } = data;
    if (Error) {
      this.setState({ error_msg: Error });
      return;
    } else {
      //generate retrieved movies jsx
      const returned_movies = (Response && !Error) ?
        Search.map((movie, i) => {
          const { Title, Year, Poster } = movie;
          const movie_id = `movie${i}`;
          return <Movie key={movie_id} id={movie_id} title={Title} year={Year} poster={Poster} />
        }) : null;

      this.setState({
        movies: returned_movies,
        error_msg: null,
        total_page: Math.floor(totalResults / 10), //retrieve 10 movies per search 
      });
      //clear Error Warning (from previous api access)
    }
  };

  sleep(ms) {//test funciton  used for delay some process
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  //when search btn clicked search with search_val 
  //access api using fetch 
  handle_submit = () => {
    const { cur_page, search_val } = this.state;

    //start accessing/loading api
    this.setState({ loading: true });
    fetch(`http://www.omdbapi.com/?s=${search_val}&page=${cur_page}&apikey=5d37056f`)
      .then(res => {
        if (!res.ok) {//handle http failures
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          return res.json();
        }
      })
      .then(this.handle_data)
      .catch(error => {//also takes care of internet errors
        this.setState({ error_msg: error.message + ", Check Internet connection" });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handle_refresh = () => {
    window.location.reload();
  };

  //handle page change request( nextpage etc.)
  handle_page_change = (page) => {
    const { cur_page } = this.state;
    const next_page = page === "Next" ? cur_page + 1 :
      page === "Prev" ? cur_page - 1 : page;
    this.setState({ cur_page: next_page });
    this.handle_submit();
  };

  display_page_nav = () => {
    const { movies, cur_page, total_page } = this.state;

    return (
      movies ? <PageNav change_page={this.handle_page_change} cur_page={cur_page} total_page={total_page} /> : ""
    );
  };


  render() {
    const { loading, error_msg, movies, cur_page, total_page } = this.state;
    return (
      <div>
        <Header refresh_page={this.handle_refresh} />
        <Search textchange={this.handle_textChange} onsearch={this.handle_submit} />
        {loading ? <h3>Loading.. please wait!</h3> :
          error_msg ? <h3>{`Sorry ${error_msg}`}</h3> :
            <div id="movie_section">{movies}</div>}
        {this.display_page_nav()}
      </div>
    );
  }
}
