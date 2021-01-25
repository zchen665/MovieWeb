module.exports = (app) => {
    const { verify_user, add_movie, add_user, get_all_movies,
        remove_movie, create_db } = require('./DB_options.js');

    //route to verify login credentials
    app.post("/api/login_request", async (req, res) => {
        const { u_name, pw } = req.body;
        console.log("Process login request...");
        console.log(`request body: ${JSON.stringify(req.body)}\n`);
        const result = await verify_user(u_name, pw);
        res.status(200).send(result);
    });

    app.post("/api/sign_up_request",async (req, res) => {
        const { u_name, pw } = req.body;
        console.log("Process sign up request... ");
        console.log(`request body: ${JSON.stringify(req.body)}\n`);
        const result = await add_user(u_name, pw);
        res.status(200).send(result);
    });

    app.get("/api/test", async (req, res) => {
        res.send("inside test.");
    });

}