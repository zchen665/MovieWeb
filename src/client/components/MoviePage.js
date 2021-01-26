import React from 'react';
import { withRouter } from 'react-router-dom';
import Movie from './Movie.js'
class MoviePage extends React.Component {
    constructor(props) {
        super(props);
        console.log("inside constructor");
        this.state = {
            info: null,
            loading: false,
            error_msg: ""
        };
    }

    //fetch movie info from api
    get_movie_info = async (movie_id) => {
        let movie_info = null,
            error_msg = "";

        // console.log(`inside get_movie_info: movie_id: ${movie_id}`);
        if (!movie_id) return null;
        await this.setState({//refresh states
            loading: true, //diplay loading phrase
            error_msg: ""
        });
        try {
            const res = await fetch(`http://www.omdbapi.com/?i=${movie_id}&apikey=5d37056f`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`); //exit when fail to retrieve
            }
            movie_info = await res.json();
            const { Response, Search, Error, totalResults } = movie_info;
            if (Error) error_msg = Error;

        } catch (error) {
            error_msg = error.message + ", Check Internet connection";
        } finally {
            this.setState({
                loading: false,
                error_msg: error_msg,
                info: movie_info
            });
        }
    }

    componentDidMount() {
        let movie_id = this.props.match.params.movie_id;
        // console.log(`inside moviepage: movie_info: ${movie_id}`);
        this.get_movie_info(movie_id);
    }

    componentDidUpdate(prevProps) {
        const cur_movie_id = this.props.match.params.movie_id;
        if (prevProps.match.params.movie_id !== cur_movie_id) {
            this.get_movie_info(cur_movie_id);
        }
    }

    render() {
        const { loading, error_msg, info } = this.state;
        const { Title, Year, Poster, Genre, Plot, Actors, Director } = info ? info :
            [null, null, null, null, null, null, null];
        //note: onselect should do nothing here
        return (
            <div>
                {loading ? <h3>Loading.. please wait!</h3> :
                    error_msg ? <h3>{`Sorry ${error_msg}`}</h3> :
                        <div className="flex_container_col" id="movie_display_container">
                            <Movie poster={Poster} year={Year} title={Title} onselect={() => ""} />
                            <dl className="flex_container" id="movie_display_details">
                                <dt>Genre:</dt>      <dd>{Genre ? Genre : "N/A"}</dd>
                                <dt>Directors:</dt>  <dd>{Director ? Director : "N/A"}</dd>
                                <dt>Actors:</dt>     <dd>{Actors ? Actors : "N/A"}</dd>
                                <dt>Plot:</dt>       <dd>{Plot ? Plot : "N/A"}</dd>
                            </dl>
                        </div>
                }

            </div>
        );
    }
}

export default withRouter(MoviePage);