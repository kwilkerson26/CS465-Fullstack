require('dotenv').config(); 

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

// Routers
const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes/index');

// Passport configuration
require('./app_api/config/passport');

// Database connection
require('./app_api/models/db');

const hbs = require('hbs');
const app = express();


// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
hbs.registerPartials(path.join(__dirname, 'app_server/views/partials'));
app.set('view engine', 'hbs');


// Middleware
app.use(logger('dev'));
app.use(express.json());                         // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


// CORS setup for Angular frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Frontend URL
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter); 


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});


// General error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: `${err.name}: ${err.message}` });
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;