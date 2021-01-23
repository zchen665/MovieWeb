module.exports = (app) => {
    const { verify_user, add_movie, add_user, get_all_movies,
        remove_movie, create_db } = require('./DB_options.js');

    //route to verify login credentials
    app.get("/login/username=:u_name&&password=:pw", async (req, res) => {
        const { u_name, pw } = req.params;
        const result = await verify_user(u_name, pw);
        res.send(result);
    })

}