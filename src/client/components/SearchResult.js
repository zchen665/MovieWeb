import React from 'react';
import { withRouter } from 'react-router-dom';
import Movie from './Movie.js';
import PageNav from './PageNav.js'

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error_msg: "",
            loading: false,
            movies: null,
            cur_page: 1,
            search_val: "",
            total_page: null,
        }
    }


    //process data from search result.
    handle_data = (data) => {
        const { Response, Search, Error, totalResults } = data;
        if (Error) {
            this.setState({ error_msg: Error });
            return;
        } else {
            //generate retrieved movies jsx
            const returned_movies = (Response && !Error) ?
                Search.map((movie, i) => {
                    const { Title, Year, Poster, imdbID } = movie;
                    const movie_id = `movie${i}`;
                    return <Movie key={movie_id} id={imdbID} title={Title} year={Year} poster={Poster} />
                }) : null;

            this.setState({
                movies: returned_movies,
                error_msg: null,
                total_page: Math.ceil(totalResults / 10), //retrieve 10 movies per search 
            });
            //clear Error Warning (from previous api access)
        }
    };

    fetch_movies = async(target_page = null) => {
        const cur_page = target_page ? target_page : this.props.match.params.cur_page;
        const { search_val } = this.props.match.params;
        // console.log(this.props.match.params);
        // console.log(`page: ${search_val}, search: ${search_val}`);
        // console.log('inside fetch: cur_page', cur_page);
        //start accessing/loading api
        await this.setState({ loading: true, cur_page: cur_page, search_val: search_val });
        fetch(`http://www.omdbapi.com/?s=${search_val}&page=${cur_page}&apikey=5d37056f`)
            .then(res => {
                if (!res.ok) {//handle http failures
                    throw new Error(`HTTP error! status: ${res.status}`);
                } else {
                    return res.json();
                }
            })
            .then(this.handle_data)
            .catch(error => {//also takes care of internet errors
                this.setState({ error_msg: error.message + ", Check Internet connection" });
            })
            .finally(() => {
                this.setState({
                    loading: false
                });
                // console.log('total_page: ',this.state.total_page);
                //directs to new page
                // this.props.history.push(`/search=${search_val}/page=${cur_page}`);
            });
    };

    componentDidMount() {
        this.fetch_movies();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.search_val != this.props.match.params.search_val ||
            prevProps.match.params.cur_page != this.props.match.params.cur_page) {
            this.fetch_movies();
        }
    }

    handle_page_change = async (page) => {
        // console.log("inside handler: ", page);
        const { search_val,cur_page } = this.state;
        const next_page = page === "Next" ? cur_page + 1 :
            page === "Prev" ? cur_page - 1 : page;
        // await this.setState({ cur_page: next_page });
        this.fetch_movies(next_page);
        this.props.history.push(`/search=${search_val}/page=${next_page}`);
    };

    render() {
        const { loading, error_msg, total_page, cur_page, movies } = this.state;
        // console.log('cur_page: ',cur_page);
        return (
            <div>
                {loading ? <h3>Loading.. please wait!</h3> :
                    error_msg ? <h3>{`Sorry ${error_msg}`}</h3> :
                        movies ? <div>
                            <div id="movie_section">{movies}</div>
                            <PageNav cur_page={cur_page} total_page={total_page} change_page={this.handle_page_change} />
                        </div> : null
                }
                
            </div>
        );
    }
}


export default withRouter(SearchResult);