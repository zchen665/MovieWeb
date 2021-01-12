import React, { Component } from 'react';
import { Header } from './components/Header.js';
import { Search } from './components/Search.js';
import Movie from './components/Movie.js'
export default class App extends Component {
  state = {
    search_val: "",
    movies: null,
    loading: false,
    errorMsg: null
  };

  handle_textChange = (text) => {
    this.setState({ search_val: text });
  };

  async handle_data(data) {
    const {Response, Search, Error} = data;
    await this.sleep(2000);
  };

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   
  //when search btn clicked search with search_val 
  //access api using fetch 
  handle_submit = () => {
    const { search_val } = this.state;

    //start accessing/loading api
    this.setState({ loading: true });
    fetch(`http://www.omdbapi.com/?s=${search_val}&apikey=5d37056f`)
      .then(res => {
        if(!res.ok){//handle http failures
          throw new Error(`HTTP error! status: ${response.status}`);
        }else{
          return res.json();
        }
      })
      .then(this.handle_data).then(()=>{this.setState({ loading: false })})
      .catch(error => {//also takes care of internet errors
        this.setState({ errorMsg: error.message });
      })
      .finally(() => {
        // this.setState({ loading: false });
      });
  };

  handle_refresh = () => {
    window.location.reload();
  };

  render() {
    const { loading, errorMsg } = this.state;
    return (
      <div>
        <Header refresh_page={this.handle_refresh} />
        <Search textchange={this.handle_textChange} onsearch={this.handle_submit} />
        {loading ? <h1>Loading.. please wait!</h1> : <h1>done loading</h1>}

        <h2>you enterted: {this.state.search_val}</h2>
        <Movie title="nima" />
      </div>
    );
  }
}
