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
            error_msg: "",
            movie_id: null,
            isAuthed: this.props.isAuthed,
            username: this.props.username,
            warning: ""
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
            const { Error } = movie_info;
            if (Error) error_msg = Error;

        } catch (error) {
            error_msg = error.message + ", Check Internet connection";
        } finally {
            this.setState({
                loading: false,
                error_msg: error_msg,
                info: movie_info,
                movie_id: error_msg ? null : movie_id //only stores omdb-trievable movie_id
            });
        }
    }

    handle_add_movie = async (e) => {
        e.preventDefault();

        const { isAuthed, username, movie_id } = this.state;

        if (isAuthed) {
            console.log("add movie");
            await this.setState({ warning: "Adding..." });

            const res = await fetch('/api/add_movie', {
                method: 'POST',
                mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_id: username, movie_id: movie_id })
            });

            const { status, message } = await res.json();
            // await new Promise(resolve => setTimeout(resolve, 1000));
            this.setState({ warning: message });


        } else {
            this.setState({ warning: "Please login first." });
        }
    }

    get_token = () => {
        const session = sessionStorage.getItem('token');
        if (session) {
            const token = JSON.parse(session);
            this.setState(token);
        }
    }

    componentDidMount() {
        const movie_id = this.props.match.params.movie_id;
        // console.log(`inside moviepage: movie_info: ${movie_id}`);
        this.get_movie_info(movie_id);
        this.get_token();
    }

    componentDidUpdate(prevProps, prevState) {
        const cur_movie_id = this.props.match.params.movie_id;
        if (prevProps.match.params.movie_id !== cur_movie_id) {
            this.get_movie_info(cur_movie_id);
        }
        if (!prevState.isAuthed) {
            this.get_token();
        }
    }

    render() {
        const { loading, error_msg, info, warning } = this.state;
        const { Title, Year, Poster, Genre, Plot, Actors, Director } = info ? info :
            [null, null, null, null, null, null, null];
        //note: onselect should do nothing here
        return (
            <div>
                {loading ? <h3>Loading.. please wait!</h3> :
                    error_msg ? <h3>{`Sorry ${error_msg}`}</h3> :
                        <div className="flex_container_col" id="movie_display_container">
                            <div className="wrapper">
                                <Movie poster={Poster} year={Year} title={Title} onselect={() => ""} />
                                <div>
                                    <button onClick={this.handle_add_movie}>Add to list</button>
                                    {warning ? <h5>{warning}</h5> : null}
                                </div>
                            </div>
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