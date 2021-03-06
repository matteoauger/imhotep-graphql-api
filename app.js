const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const graphqlHTTP = require('express-graphql');
const AdGraphQL = require('./graphql/ad');
const UserGraphQL = require('./graphql/user');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setting up graphql ad schema
app.use(
  '/ads',
  graphqlHTTP({
    schema: AdGraphQL.schema,
    rootValue: AdGraphQL.root,
    graphiql: process.env.NODE_ENV === 'development',
  })
);
// setting up graphql user schema
app.use(
  '/users',
  graphqlHTTP({
    schema: UserGraphQL.schema,
    rootValue: UserGraphQL.root,
    graphiql: process.env.NODE_ENV === 'development'
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
