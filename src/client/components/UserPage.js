import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import MovieRow from './MovieRow';


//For learning purpose this component will be functional
const UserPage = (props) => {
    const [movie_list, set_movie_list] = useState(null);
    const [loading, set_loading] = useState(false);
    const [warning, set_warning] = useState("");

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
            console.log(response);
            if (status == -1) {//retrive failed.
                console.log("db returned -1 for status")
                set_warning(message);
            } else if (movie_id_list) {
                const movie_rows = movie_id_list.map((movie_id, index) => {
                    return <MovieRow key={index} movie_id={movie_id} />
                })

                set_movie_list(movie_rows);
                set_warning("");
            }

        } catch (err) {
            console.log("err msg: ", err.message);
        } finally {
            set_loading(false);
        }

    }

    useEffect(() => {
        get_movie_list();

        return () => console.log("unmounting");
    }, []);

    const handle_log_out = (e) => {
        const status = -1; //-1 for logging out in app.js handle_log_inout handler
        e.preventDefault();
        console.log("clicked log out button");
        sessionStorage.removeItem('token');
        props.logout_request(status);
        props.history.push('/');
    };

    return (
        <div>
            <div className="wrapper">
                <p>Your list:</p>
                <button onClick={handle_log_out}>Log out</button>
            </div>
            <div>
                {loading ? <h4>Loading...Please wait.</h4> :
                    warning ? <h4>{warning}</h4> :
                        movie_list ? movie_list :
                            <h4>Your list is currently empty</h4>}
            </div>
        </div>
    );

}
export default withRouter(UserPage);