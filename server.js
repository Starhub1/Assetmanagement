//load env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const expressLayouts = require('express-ejs-layouts');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');


//configure the application
//tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

//set ejs as templating engine
app.set('view engine','ejs');
app.use(expressLayouts);

//connect to db

mongoose.connect("mongodb+srv://test:test@cluster0-bm3xl.mongodb.net/test?retryWrites=true");

// use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressValidator());

//set the routes
app.use(require('./app/route'))

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});

