import React, { Component } from 'react';
import { Header } from './components/Header.js';
import { Search } from './components/Search.js';
export default class App extends Component {
  state = {
    username: null,
    search_val: "",
  };


  componentDidMount() {
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));

    //   // XML
  }

  handle_textChange = (text) => {
    this.setState({ search_val: text });
  }



  handle_submit = (e) => {
    console.log("app clicked");
    console.log("cur val: "+ this.state.search_val)
  };

  render() {
    const { username } = this.state;
    return (
      <div>
        <Header />
        {/* <Search onsearch = {this.handleSumbit}/> */}
        <Search textchange={this.handle_textChange} onsearch={this.handle_submit} />
        {/* {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>} */}
      </div>
    );
  }
}
