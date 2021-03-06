//load env file
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8082;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
var CronJob = require('cron').CronJob;
const ReportController = require('./app/controllers/report.controller');

// Passport Config
require('./config/passport')(passport);

//configure the application
// set sessions and cookie parser
app.use(require('morgan')('combined'));
app.use(cookieParser());
app.use(
  require('express-session')({
    secret: '343ji43j4n3jn4jk3n',
    resave: false, // forces the session to be saved back to the store
    saveUninitialized: false, // dont save unmodified
    cookie: {
      secure: false,
      maxAge: 3600000 //1 hour
    }
  })
);
app.use(flash());

//tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

//set ejs as templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

//connect to local db
mongoose.connect('mongodb://localhost/AssetManagement', {
  useNewUrlParser: true
});

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

// set the cron job
const job = new CronJob('5 4 * * fri', function() {
  ReportController.generateReport();
  console.log('Generating the Report...');

});
job.start();
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
