import React, { Component } from 'react';

class Search extends Component {
    constructor(props) {
        super(props);
    }

    handle_onsubmit = (e) => {
        e.preventDefault();
        this.props.onsearch();
    }

    handle_text_change = (e) => {
        this.props.textchange(e.target.value);
    }

    render() {

        return (
            <div >
                <form id='search_bar' className="flex_container" >
                    <input
                        id='search_textbox'
                        type="text"
                        onChange={this.handle_text_change}
                        placeholder="Search Something"
                    />
                    <button id='search_btn' className="clean_btn" onClick= {this.handle_onsubmit}><i className="fas fa-search fa-lg"></i> </button>
                </form>
            </div>
        );
    }
}

export { Search };