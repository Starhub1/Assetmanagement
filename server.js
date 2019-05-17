//load env file
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8082;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport= require('passport');

// Passport Config
require('./config/passport')(passport);

//configure the application
// set sessions and cookie parser
app.use(require('morgan')('combined'));
app.use(cookieParser());
app.use(
  session({
    secret: '343ji43j4n3jn4jk3n',
    cookie: { maxAge: 60000 },
    resave: false, // forces the session to be saved back to the store
    saveUninitialized: false // dont save unmodified
  })
);
app.use(flash());

//tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

//set ejs as templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

//connect to local db
mongoose.connect("mongodb://localhost/AssetManagement", {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connected...');
});

// use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//set the routes
app.use(require('./app/route'));

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
