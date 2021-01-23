const mysql = require('mysql2/promise');
const { util } = require('webpack');
const [admin_user, admin_host, admin_pw, db_name] = ['root', 'localhost', '12580@Czz', 'mv_app'];
const db_config = {
    host: admin_host,
    user: admin_user,
    password: admin_pw,
    database: db_name
};


//create database named db_name
const create_db = async () => {
    let con;

    //res contains information to return  about this query
    let res = {
        status: null, //1: success, -1: failure
        message: ""
    };

    try {
        con = await mysql.createConnection({
            host: admin_host,
            user: admin_user,
            password: admin_pw
        });

        await con.query(`CREATE DATABASE ${db_name}`);
        res.message = "Created new database";
        res.status = 1;
    } catch (err) {
        res.message = err.message;
        res.status = -1;
    } finally {
        con.end();
    }
    return res;
};

//initiate both tables needed
const create_table = async () => {
    let con;
    let res = {
        message: "",
        status: null
    }
    try {
        con = await mysql.createConnection(db_config);

        //user table
        let sql_cmd = 'CREATE TABLE IF NOT EXISTS uasdfWs(id INT AUTO_INCREMENT PRIMARY KEY, \
            name VARCHAR(63), password VARCHAR(63))';
        const result_user_table = await con.query(sql_cmd);

        //table may already exists or some other warnings. log warnings if any
        if (result_user_table[0].warningStatus !== 0) {
            let warning = await con.query("SHOW WARNINGS");
            console.log(warning[0][0].Message);
        };
        console.log("Done creating users table");

        //movie table
        sql_cmd = 'CREATE TABLE IF NOT EXISTS movies(id INT AUTO_INCREMENT PRIMARY KEY, \
            user_id VARCHAR(63), movie_id VARCHAR(63))';
        const result_movie_table = await con.query(sql_cmd);

        if (result_movie_table[0].warningStatus !== 0) {
            let warning = await con.query("SHOW WARNINGS");
            console.log(warning[0][0].Message);
        };
        console.log("Done creating movies table");

        res = {
            message: "Both tables created.",
            status: 1
        }
    } catch (err) {
        res = {
            message: err.message,
            status: -1
        }
    } finally {
        con.end();
    }
    return res;
};


//
const add_user = async (u_name, u_pw) => {
    let res = {
        message: "",
        status: null
    }
    let con;
    try {
        con = await mysql.createConnection(db_config);

        //check if user name already been registered
        const result = await con.query("SELECT name FROM users WHERE name =BINARY ?", [u_name]);
        if (!result[0][0]) {
            let sql_cmd = "INSERT INTO users (name, password) VALUES (?,?)";
            await con.query(sql_cmd, [u_name, u_pw]);
            res = {
                message: "Account created!",
                status: 1
            }
        } else {
            res.message = "User already exists."
            res.status = -1;
        }
    } catch (err) {
        console.log(err);
        res = {
            message: err.message,
            status: -1
        }
    } finally {
        con.end();
    }
    return res;
}

const verify_user = async(u_name, u_pw)=>{
    let con;
    let res = {
        message: "",
        status: null
    }

    try {
        con = await mysql.createConnection(db_config);
        let sql_cmd = "SELECT * FROM users WHERE name = BINARY ? AND password = BINARY ?";
        const result = await con.query(sql_cmd, [u_name, u_pw]);
        if (result[0][0]) {
            res = {
                message:  "Login success.",
                status: 1
            }
        }else{
            res = {
                message: "Check user name and password again",
                status: -1
            }
        }
    } catch (err) {
        console.log(err);
        res = {
            message: err.message,
            status: -1
        }
    } finally{
        con.end();
    }
    return res;
}

//
const add_movie = async (u_id, movie_id) => {
    let con;
    let res = {
        message: "",
        status: null
    }
    try {
        con = await mysql.createConnection(db_config);

        //find movies associated with target user
        const result = await con.query("SELECT movie_id FROM movies WHERE user_id = BINARY? AND movie_id =?", [u_id, movie_id]);
        if (result[0].length !== 0) { //user already has this movie added
            res = {
                message: "Movie already exists.",
                status: -1,
            }
        } else { //if not present then add this movie 
            let sql_cmd = "INSERT INTO movies (user_id, movie_id) VALUES (?,?)";
            await con.query(sql_cmd, [u_id, movie_id]);
            res = {
                message: "Movie added.",
                status: 1,
            }
        }
    } catch (err) {
        console.log(err);
        res = {
            message: err.Message,
            status: -1
        }
    } finally {
        con.end();
    }
    return res;
}

const remove_movie = async (u_id, movie_id) => {
    let con;
    let res = {
        message: "",
        status: null
    }
    try {
        con = await mysql.createConnection(db_config);

        //remove target movie
        const result = await con.query("DELETE FROM movies WHERE user_id = BINARY ? AND movie_id =?", [u_id, movie_id]);
        if (result[0].affectedRows > 0) {
            res = {
                message: "Movie removed.",
                status: 1
            }
        } else {
            res = {
                message: "Target movie not in record.",
                status: 1
            }
        }
    } catch (err) {
        console.log(err);
        res = {
            message: err.Message,
            status: -1
        }
    } finally {
        con.end();
    }
    return res;
}

const get_all_movies = async (u_id) => {
    let con;
    let res = {
        message: "",
        status: null,
        data: null   //store the movie_id returned from db
    }
    try {
        con = await mysql.createConnection(db_config);

        //retrive all movies from target user
        const result = await con.query("SELECT movie_id FROM movies WHERE user_id = BINARY?", [u_id]);
        res = {
            message: "Retrived all movies.",
            status: 1,
            data: result[0].map(id => id.movie_id)
        }

    } catch (err) {
        console.log(err);
        res = {
            message: err.Message,
            status: -1
        }
    } finally {
        con.end();
    }
    return res;
}

// (async () => {
//     // await add_user("DAOKO", "1234");
//     // let val_1 = await get_all_movies("DAOKO","GOD BLOW");
//     // console.log("result: ", val_1);
//     let val_2 = await remove_movie("DAOKO", "god BLOW");
//     console.log("result 2:", val_2);

// })();

module.exports = {
    create_db: create_db,
    create_table: create_table,
    add_user: add_user,
    add_movie: add_movie,
    remove_movie: remove_movie,
    get_all_movies: get_all_movies,
    verify_user: verify_user
}

