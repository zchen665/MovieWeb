module.exports = (app) => {
    const { verify_user, add_movie, add_user, get_all_movies,
        remove_movie, create_db } = require('./DB_options.js');

    //route to verify login credentials
    app.post("/api/login_request", async (req, res) => {
        const { u_name, pw } = req.body;
        console.log("Process login request...");
        console.log(`request body: ${JSON.stringify(req.body)}`);
        const result = await verify_user(u_name, pw);
        console.log(`query result: ${result.message}\n`)
        res.status(200).send(result);
    });

    app.post("/api/sign_up_request", async (req, res) => {
        const { u_name, pw } = req.body;
        console.log("Process sign up request... ");
        console.log(`request body: ${JSON.stringify(req.body)}`);
        const result = await add_user(u_name, pw);
        console.log(`query result: ${result.message}\n`)
        res.status(200).send(result);
    });

    app.post("/api/add_movie", async (req, res) => {
        const { u_id, movie_id } = req.body;
        console.log("Process add movie request");
        console.log(`request body: ${JSON.stringify(req.body)}`);
        const result = await add_movie(u_id, movie_id);
        console.log(`query result: ${result.message}\n`)
        res.status(200).send(result);
    });

    //double check http method. not sure if this should be a post or get
    app.post("/api/get_movies", async (req, res) => {
        const { u_id } = req.body;
        console.log("Process get user movie list request");
        console.log(`request body: ${JSON.stringify(req.body)}`);
        const result = await get_all_movies(u_id);
        console.log(`query result: ${result.message}\n`)
        res.status(200).send(result);
    });

    app.delete("/api/remove_movie", async (req, res) => {
        const { u_id, movie_id } = req.body;
        console.log("Process remove movie request");
        console.log(`request body: ${JSON.stringify(req.body)}`);
        const result = await remove_movie(u_id, movie_id);
        // const result = {gg: "gggggggg"};
        console.log(`query result: ${result.message}\n`)
        res.status(200).send(result);
    });


    app.get("/api/test", async (req, res) => {
        res.send("inside test.");
    });

}