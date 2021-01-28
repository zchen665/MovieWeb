import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import MovieRow from './MovieRow';


//For learning purpose this component will be functional
const UserPage = (props) => {
    const [movie_list, set_movie_list] = useState([]);
    const [loading, set_loading] = useState(false);
    const [warning, set_warning] = useState("");
    const [display_list, set_display_list] = useState([]);

    const cur_display_list = React.useRef(display_list);
    const cur_movie_list = React.useRef(movie_list);


    useEffect(() => {
        let is_active = true;
        const get_username = async () => {
            const session = sessionStorage.getItem('token');
            if (session) {
                const token = await JSON.parse(session);
                return token.username;
            }
            return null;
        }

        const get_movie_list = async () => {
            set_loading(true);
            const username = await get_username();
            if (!username) {//normally will not be here
                set_warning("Can't confirm login information. Please login again");
                set_loading(false);
                return;
            }

            try {
                const res = await fetch('/api/get_movies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ u_id: username })
                });

                const response = await res.json();
                const { message, status, data: movie_id_list } = response;

                if (status == -1) {//retrive failed.
                    is_active ? set_warning(message) : null;
                } else {
                    const movie_rows = movie_id_list.map((movie_id, index) => {
                        return <MovieRow key={index} movie_id={movie_id} username={props.username} on_remove={handle_remove} />
                    })

                    is_active ? set_display_list(movie_id_list) : null;
                    cur_display_list.current = movie_id_list;
                    is_active ? set_movie_list(movie_rows) : null;
                    cur_movie_list.current = movie_rows;
                    is_active ? set_warning("") : null;
                }

            } catch (err) {
                console.log("err msg: ", err.message);
            } finally {
                is_active ? set_loading(false) : null;
            }
        }

        get_movie_list();

        return () => is_active = false;
    }, []);

    const handle_remove = (id) => {
        const idx_to_remove = cur_display_list.current.indexOf(id);
        cur_display_list.current.splice(idx_to_remove, 1);
        cur_movie_list.current.splice(idx_to_remove, 1);

        //set new array object to rerender
        set_display_list([...cur_display_list.current]);
        set_movie_list([...cur_movie_list.current]);
    }

    const handle_log_out = (e) => {
        const status = -1; //-1 for logging out in app.js handle_log_inout handler
        e.preventDefault();

        sessionStorage.removeItem('token');
        props.logout_request(status);
        props.history.push('/');
    };

    return (
        <div>
            <div id='user_page_header' className="flex_container">
                <h3>Your movie list:</h3>
                <button
                    onClick={handle_log_out}
                    id='logout_btn'
                    className="clean_btn underline_effect"
                >Log out</button>
            </div>
            <div>
                {loading ? <h4>Loading...Please wait.</h4> :
                    warning ? <h4>{warning}</h4> :
                        movie_list.length != 0 ? movie_list :
                            <h4>Your list is currently empty</h4>}
            </div>
        </div>
    );

}
export default withRouter(UserPage);