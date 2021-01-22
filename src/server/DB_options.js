const mysql = require('mysql2/promise');
const { util } = require('webpack');
const [admin_user, admin_host, admin_pw, db_name] = ['root', 'localhost', '12580@Czz', 'mv_app'];


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
        res.message = "Connected! about to create new database";
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
        con = await mysql.createConnection({
            host: admin_host,
            user: admin_user,
            password: admin_pw,
            database: db_name
        });

        //user table
        console.log("Connected! about to create new table");
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
            user_id INTEGER, movie_id VARCHAR(63))';
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
        con = await mysql.createConnection({
            host: admin_host,
            user: admin_user,
            password: admin_pw,
            database: db_name
        });

        //check if user name already been registered
        const result = await con.query("SELECT name FROM users WHERE name = ?", [u_name]);
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
        res = {
            message: err.message,
            status: -1
        }
    } finally {
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
        con = await mysql.createConnection({
            host: admin_host,
            user: admin_user,
            password: admin_pw,
            database: db_name
        });

        const result = await con.query("SELECT movie_id FROM movies WHERE user_id =?", u_id);
        console.log(result[0][0].movie_id);

        let sql_cmd = "INSERT INTO movies (user_id, movie_id) VALUES (?,?)";
        await con.query(sql_cmd, [u_id, movie_id]);
        console.log("inserted ")


    } catch (err) {
        res = {
            message: err.Message,
            status: -1
        }
    } finally {
        con.end();
    }
    return res;
}

// create_db();

// create_table();
let val;
(async () => {
    // for (let i = 0; i < 500; i++) {
    //     val = await add_user(`daddy${i}`, "12354");

    //     // val = await create_table();
    //     console.log("Result:", val);
    // }
    let res = await add_movie(1, "shentama ");
    console.log(res);
})();

// add_user("shen", "12354");

console.log("end");
// add_movie(1, 'ttdiaonima');



module.exports = {
    insert_user: add_user,
    insert_movie: add_movie
}
