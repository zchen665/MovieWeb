import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import no_poster from '../img/no_poster.png';

const MovieRow = (props) => {
    const [title, set_title] = useState(null);
    const [poster, set_poster] = useState(null);
    const [year, set_year] = useState(null);
    const [warning, set_warning] = useState("");
    const [loading, set_loading] = useState(false);

    const get_movie_info = async () => {
        set_loading(true);
        try {
            const res = await fetch(`http://www.omdbapi.com/?i=${props.movie_id}&apikey=5d37056f`)
            if (!res.ok) {//handle http failures
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const { Error, Response } = data;
            if (Error && !Response) { set_warning(Error); }
            else {
                const { Year, Poster, Title } = data;
                set_year(Year);
                set_poster(Poster);
                set_title(Title);
                set_warning("");
            }
        } catch (err) {
            set_warning(err.message);
        } finally {
            set_loading(false);
        }
    }


    useEffect(() => {
        get_movie_info();
    }, []);

    const redirect = () => {
        props.history.push(`/movie_id=${props.movie_id}`);
    }

    return (
        <div className='movie_row' onClick={redirect}>
            {
                loading ? <h4>loading...</h4> :
                    warning ? <h4>{warning}</h4> :
                        <div className='flex_container row_narrow_wrapper'>
                            <img className='small_img' src={poster == "N/A" ? no_poster : poster} />
                            <h4>Title: {title}</h4>
                            <h4>Year: {year}</h4>
                        </div>
            }
        </div>);
}

export default withRouter(MovieRow);