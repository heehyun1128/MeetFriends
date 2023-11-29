const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const { environment } = require('./config');
const isProduction = environment === 'production';

const { ValidationError } = require('sequelize');


const routes = require('./routes');

const app = express();
app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());


// app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
// });

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// connecting the exported router to app after all the middlewares.
app.use(routes); // Connect all the routes

// catch any requests that don't match any of the routes defined and create a server error with a status code of 404.
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});
// catching Sequelize errors and formatting them before sending the error response
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
    err.status=400
    err.message = "Bad Request"
  }
  next(err);
});

// Error formatter - formatting all the errors before returning a JSON response
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  
  res.json({
    // title: isProduction ? null : err.title? null :'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;