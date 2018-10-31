var express = require('express'),
  app = express(),
  port = process.env.PORT || 3339,
  mongoose = require('mongoose'),
  Chat = require('./api/models/chatModel'),
  User = require('./api/models/userModel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/chatDb').then(
  (res) => {
      console.log("Successfully connected to the database.")
  }
  ).catch(() => {
    console.log("Conntection to database failed.");
}); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/chatRoutes'); //importing route
routes(app); //register the route


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});




app.listen(port);


console.log('RESTful API server started on: ' + port);