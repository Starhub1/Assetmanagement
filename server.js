//load env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const expressLayouts = require('express-ejs-layouts');
const mongoose  = require('mongoose');


//configure the application
//tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

//set ejs as templating engine
app.set('view engine','ejs');
app.use(expressLayouts);

//connect to db

mongoose.connect("mongodb+srv://test:test@cluster0-bm3xl.mongodb.net/test?retryWrites=true");

//set the routes
app.use(require('./app/route'))

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});

