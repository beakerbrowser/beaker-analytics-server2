const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
// const AWSXRay = require('aws-xray-sdk');

const config = require('./lib/config')
const db = require('./lib/db')

const indexRouter = require('./routes/index');

module.exports = async function () {
  await db.setup()
  var app = express();

  // app.use(AWSXRay.express.openSegment('Userlist'));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({error: req.app.get('env') === 'development' ? err : true})
  });

  // app.use(AWSXRay.express.closeSegment());

  return app
}
