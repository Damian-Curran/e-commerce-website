var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var products = require('./routes/products');
var users = require('./routes/users');

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect('mongodb://localhost/e-commerce')
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var app = express();

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/products', products);
app.use('/users', users);
  
module.exports = app;