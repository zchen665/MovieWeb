import React, { Component } from 'react';
import s_icon from '../img/search_icon.png';
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
                    <button id='search_btn' className="clean_btn" onClick={this.handle_onsubmit}><img src={s_icon} alt='Search' /> </button>
                </form>
            </div>
        );
    }
}

export { Search };