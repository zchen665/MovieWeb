import React from 'react';

//implements navigator buttons 
//passing onClick to PageNav component
class NavBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_page: this.props.cur,
            content: this.props.content
        }
        //could've done with function expression
        //trying to learn syntax
        this.handle_onclick = this.handle_onclick.bind(this);
    }

    handle_onclick() {
        const { content} = this.state;
        this.props.onClick(content);//passing to parent
    }

    render() {
        const { cur_page, content } = this.state;

        return (
            <button className={`nav_btn ${content == cur_page ? " page_active" : ""}`} onClick={this.handle_onclick}>{this.props.content}</button>
        );
    }
}

//the bottom navigator for search
//passing click event to parent(app.js)
class PageNav extends React.Component {
    state = {
        cur_page: this.props.cur_page,
        total_page: this.props.total_page
    };

    handle_onclick = (content) => {
        this.props.change_page(content);
    };

    render() {
        const { cur_page, total_page } = this.state;
        const placeholder = (total_page <= 6) ? "" : "..."; //hide all "..." when totalpage is less than 7
        const front_p = (cur_page > 4) ? placeholder : "";
        const end_p = (cur_page < total_page - 3) ? placeholder : "";

        //allows 2 nearest neighbor, total of 5 buttons shown at a time not including first and 
        //last page
        const btn_list = () => {
            let btns = [];
            if (total_page <= 5) {
                for (let i = 1; i <= total_page; i += 1) {
                    btns.push(i);
                }
            } else {
                if (cur_page <= 3) btns = [1, 2, 3, 4, 5];
                else if (cur_page >= total_page - 2) {
                    btns = [4, 3, 2, 1, 0].map(val => total_page - val);
                }
                else {
                    for (let i = 0; i < 5; i += 1) {
                        btns.push(cur_page + i - 2);
                    }
                }
            }

            return (
                <p>
                    {(cur_page != 1) ? <NavBtn onClick={this.handle_onclick} content='Prev' /> : ""} 	{" "}
                    {(btns.includes(1)) ? "" : <NavBtn onClick={this.handle_onclick} content={1} />}
                    {front_p}
                    {btns.map((val, index) => <NavBtn onClick={this.handle_onclick} cur={cur_page} content={val} key={index}></NavBtn>)}
                    {end_p}
                    {(btns.includes(total_page)) ? "" : <NavBtn onClick={this.handle_onclick} content={total_page} />}{" "}
                    {(cur_page != total_page) ? <NavBtn onClick={this.handle_onclick} content='Next' /> : ""}
                </p>
            );
        }

        return (
            <div className="page_navigator" >
                {btn_list()} 
            </div>
        );
    }
}

export { PageNav };