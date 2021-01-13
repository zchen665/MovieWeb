import React, { Component } from 'react';
import { Header } from './components/Header.js';
import { Search } from './components/Search.js';
import Movie from './components/Movie.js';
import { PageNav } from './components/PageNav.js';
import MoviePage from './components/MoviePage.js';

export default class App extends Component {
  state = {
    search_val: "",
    movies: null, //stores search results in array of JSX Movie component
    loading: false,
    error_msg: null,
    cur_page: 1,
    total_page: null,
    display_movie_page: false, //controls the display of a detailed report on one movie 
    target_movie_info: null, //the info of the detailed movie display
  };

  //get value from search bar text field
  handle_textChange = (text) => {
    this.setState({ search_val: text });
  };

  //handle the event when a movie is selected for 
  //detailed report 
  handle_movie_select = async (movie_id) => {
    await this.setState({
      movies: null,
      loading: true,
      error_msg: null
    });
    try {
      const res = await fetch(`http://www.omdbapi.com/?i=${movie_id}&apikey=5d37056f`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`); //exit when fail to retrieve
      }
      const movie_info = await res.json();

      this.setState({
         display_movie_page: true,
         target_movie_info: movie_info,
       });

    } catch (error) {
      this.setState({ error_msg: error.message + ", Check Internet connection" });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }



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
          return <Movie onselect={this.handle_movie_select} key={movie_id} id={imdbID} title={Title} year={Year} poster={Poster} />
        }) : null;

      this.setState({
        movies: returned_movies,
        error_msg: null,
        total_page: Math.ceil(totalResults / 10), //retrieve 10 movies per search 
      });
      //clear Error Warning (from previous api access)
    }
  };
  //test funciton  used for delay some process
  sleep(ms) {
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
          throw new Error(`HTTP error! status: ${res.status}`);
        } else {
          return res.json();
        }
      })
      .then(this.handle_data)
      .catch(error => {//also takes care of internet errors
        this.setState({ error_msg: error.message + ", Check Internet connection" });
      })
      .finally(() => {
        this.setState({ 
          loading: false,
          display_movie_page : false, 
        });
      });
  };

  //home button in Hearder for refresh page
  handle_refresh = () => {
    window.location.reload();
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

  render() {
    const { target_movie_info, display_movie_page, loading, error_msg, movies, cur_page, total_page } = this.state;
    return (
      <div className="flex_container_col">
        <div id="web_content">
          <Header refresh_page={this.handle_refresh} />
          <Search textchange={this.handle_textChange} onsearch={this.handle_submit} />
          {loading ? <h3>Loading.. please wait!</h3> :
              error_msg ? <h3>{`Sorry ${error_msg}`}</h3> :
                display_movie_page? <MoviePage movie_info= {target_movie_info}/> :
                <div id="movie_section">{movies}</div>}
          {!display_movie_page ?
            loading ? "" :
              error_msg ? "" :
                movies ? <PageNav change_page={this.handle_page_change} cur_page={cur_page} total_page={total_page} /> : ""
            : ""
          }
        </div>

        <footer><p>Based on omdb api</p></footer>
      </div>
    );
  }
}
