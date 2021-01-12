import React from "react";

export default class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poster: null,
            title: null,
            description: null
        }
    }


    render() {
        const { title, description, poster } = this.state;
        return (
            <div>
                {title ? < h3 > title exist</h3> : <h3>no title</h3>}

            </div>

        );
    }
}