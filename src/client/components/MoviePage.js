import React from 'react';
import Movie from './Movie.js'
export default class MoviePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: this.props.movie_info
        };
    }

    render() {
        const { Title, Year, Poster, Genre, Plot, Actors, Director } = this.state.info;
        //note: onselect should do nothing here
        return (
            <div className="flex_container_col" id="movie_display_container">
                <Movie poster={Poster} year={Year} title={Title} onselect={() => ""} />
                <dl className="flex_container" id="movie_display_details">
                    <dt>Genre:</dt>      <dd>{Genre? Genre : "N/A"}</dd>
                    <dt>Directors:</dt>  <dd>{Director? Director : "N/A"}</dd>
                    <dt>Actors:</dt>     <dd>{Actors? Actors : "N/A"}</dd>
                    <dt>Plot:</dt>       <dd>{Plot? Plot : "N/A"}</dd>
                </dl>
            </div>
        );
    }
}