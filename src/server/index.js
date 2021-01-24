const express = require('express'),
  body_parser = require('body-parser');
const os = require('os');
const app = express();


app.use(body_parser.json()); //for HTTP put request
app.use('/', express.static('dist'));

require('./controller.js')(app);
// app.use((req,res,next)=>{
//   res.status(200).send("response");
// })
app.use((err,req,res,next)=>{
  console.log('inside err handler');
  console.error(err.stack);
  res.status(500).send('Something broke!');
})
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
