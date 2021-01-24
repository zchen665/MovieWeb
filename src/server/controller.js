module.exports = (app) => {
    const { verify_user, add_movie, add_user, get_all_movies,
        remove_movie, create_db } = require('./DB_options.js');

    //route to verify login credentials
    app.post("/api/login_request", async (req, res, next) => {
        const { u_name, pw } = req.body;
        console.log("accessed. ");
        console.log(`request body: ${req.body}`);
        console.log(req.body);
        const result = await verify_user(u_name, pw);
        res.status(200).send(result);
    });

    app.get("/api/test", async (req, res) => {
        res.send("inside test.");
    });

}