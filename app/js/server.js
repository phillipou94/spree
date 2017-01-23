var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var webpackDevHelper = require('./hotReload.js');

// Require routes.
var BankRoutes = require('../routes/BankRoutes.js');
var EventRoutes = require('../routes/EventRoutes.js');
var TicketRoutes = require('../routes/TicketRoutes.js');
var UserRoutes = require('../routes/UserRoutes.js');
var WeekRoutes = require('../routes/WeekRoutes.js');

/** Set up MongoDB **/

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/spree');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

// Set up webpack-hot-middleware for development, express-static for production
if (process.env.NODE_ENV !== 'production'){
  console.log("DEVELOPMENT: Turning on WebPack middleware...");
  app = webpackDevHelper.useWebpackMiddleware(app);
  app.use('/style', express.static(path.join(__dirname, 'app/style')));
} else {
  console.log("PRODUCTION: Serving static files");
  app.use(express.static(path.join(__dirname,"app")));
}

// Set up some middleware to use.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: 'fdjskalj9320DSFDs392dsac',
  duration: 30 * 24 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));



// Set up our routes.
app.use('/api/users', UserRoutes);
app.use('/api/banks', BankRoutes);
app.use('/api/weeks', WeekRoutes);
app.use('/api/events', EventRoutes);
app.use('/api/tickets', TicketRoutes);
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, '../index.html'));
});


app.listen((process.env.PORT || 3000), function() {
  console.log("Listening for port");
});


// Export our app (so that tests and bin can find it)
module.exports = app;
