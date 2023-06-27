require('dotenv').config();
const express = require('express');
var cors = require('cors');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const app = express();

// cors
app.use(cors());

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init dbs
require('./databases/init.mongodb');

// init routes
app.use('', require('./routes'));

// handling error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    // stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
