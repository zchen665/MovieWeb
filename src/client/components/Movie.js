import React from "react";
import no_poster from '../img/no_poster.png';
export default class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poster: this.props.poster,
            title: this.props.title,
            year: this.props.year,
            id: this.props.id
        }
    }


    render() {
        const { title, year,id } = this.state;
        const poster = (this.props.poster === "N/A") ? no_poster : this.props.poster;
        return (
            <div className = "movie_container" id= {id}>
                <h3 className="movie_title">{title}</h3>
                <div className="movie_poster">
                    <img 
                        alt={`poster for ${title}`}
                        src={poster}
                    />
                </div>
                <h3 className="movie_year">{year}</h3>
            </div>

        );
    }
}