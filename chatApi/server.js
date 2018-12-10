var express = require('express'),
  app = express(),
  config = require('./config'),
  port = process.env.PORT || 3339,
  mongoose = require('mongoose'),
  Chat = require('./api/models/chatModel'),
  User = require('./api/models/userModel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.database).then(
  (res) => {
      console.log("Successfully connected to the database.")
      Chat.remove({}, function(err) {
        console.log('something went wrong ' + err)
      });
      User.remove({}, function(err) {
        console.log('something went wrong ' + err)
      });
      console.log('Models deleted!')
  }
  ).catch((err) => {
    console.log("Connection to database failed");
});
app.set('superSecret', config.secret);
app.set('saltRounds', config.saltRounds);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/chatRoutes'); //importing route
routes(app); //register the route


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});




app.listen(port);


console.log('RESTful API server started on: ' + port);