import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import no_poster from '../img/no_poster.png';

const MovieRow = (props) => {
    const [title, set_title] = useState(null);
    const [poster, set_poster] = useState(null);
    const [year, set_year] = useState(null);
    const [warning, set_warning] = useState("");
    const [loading, set_loading] = useState(false);
    const [button_feedback, set_button_feedback] = useState("");

    let is_active = true;

    const get_movie_info = async () => {
        set_loading(true);
        try {
            const res = await fetch(`http://www.omdbapi.com/?i=${props.movie_id}&apikey=5d37056f`)
            if (!res.ok) {//handle http failures
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const { Error, Response } = data;
            if (Error && !Response && is_active) { set_warning(Error); }
            else if (is_active) {
                const { Year, Poster, Title } = data;
                set_year(Year);
                set_poster(Poster);
                set_title(Title);
                set_warning("");
            }
        } catch (err) {
            is_active ? set_warning(err.message) : null;
        } finally {
            is_active ? set_loading(false) : null;
        }
    }


    useEffect(() => {
        get_movie_info();

        return () => is_active = false;
    }, []);

    //will not redirect if any warning given 
    //which covers cases for invalid movie id
    const redirect = () => {
        if (!warning)
            props.history.push(`/movie_id=${props.movie_id}`);
    }

    const remove_movie = async () => {
        set_button_feedback("");
        try {
            const res = await fetch('/api/remove_movie', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_id: props.username, movie_id: props.movie_id })
            })

            const data = await res.json();
            if (data && data.status == 1) {
                props.on_remove(props.movie_id);
            } else throw new Error(data ? data.message : "No data retrived from server");
        } catch (err) {
            console.log(err.message)
            is_active ? set_button_feedback(err.message) : null;
        }
    }

    return (
        <div>
            {
                loading ? <h4>loading...</h4> :
                    warning ? <h4>{warning}</h4> :
                        <div className='flex_container row_narrow_wrapper'>
                            <div
                                onClick={redirect}
                                className='flex_container small_movie_display'
                            >
                                <img className='small_img' src={poster == "N/A" ? no_poster : poster} />
                                <h4> {title}</h4>
                                <h4> {year}</h4>
                            </div>
                            <div className='flex_container_col rmv_btn_wrapper'>
                                <button onClick={remove_movie}
                                    className='clean_btn'
                                >Remove</button>
                                <p>{button_feedback}</p>
                            </div>
                        </div>
            }
        </div>);
}

export default withRouter(MovieRow);