const express = require('express');
const os = require('os');
const { nextTick } = require('process');
const {insert_movie,insert_user} = require('./DB_options.js');

const app = express();
insert_movie(5,"ttabsc");

app.use('/',express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/', function (req, res, next) {
  next();
  res.send('Hello World!');
})


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
