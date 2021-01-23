const express = require('express'),
  body_parser = require('body-parser');
const os = require('os');


const app = express();

app.use(body_parser.json()); //for HTTP put request
app.use('/', express.static('dist'));

require('./controller.js')(app);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
