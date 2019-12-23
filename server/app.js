var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

const uri = "mongodb+srv://danobaca:plsbacai@aramisdb-635xs.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true},function(err, client) {
  if(err) {
    console.log('Error occurred while connecting to Mongoose...\n',err);
  }
  else {
    console.log('Mongoose Connected...'); 
  }
});



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var flowersRouter = require('./routes/flowers');
var profileRouter = require('./routes/profile');
var auctionRouter = require('./routes/auction');

var app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/flowers', flowersRouter);
app.use('/profile', profileRouter);
app.use('/auction', auctionRouter);


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
  res.render('error');
});

module.exports = app;
