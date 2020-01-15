const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const startAuction = require('./functions/startAuction');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socket  = require('./socketIO/socket');

socket.startConnection(io);
startAuction(io);



const uri = "mongodb+srv://danobaca:plsbacai@aramisdb-635xs.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true},function(err, client) {
  if(err) {
    console.log('Error occurred while connecting to Mongoose...\n',err);
  }
  else {
    console.log('Mongoose Connected...'); 
  }
});
mongoose.set('useFindAndModify', false);





const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const flowersRouter = require('./routes/flowers');
const profileRouter = require('./routes/profile');
const auctionRouter = require('./routes/auction');
const historyRouter = require('./routes/history');




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
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header('Access-Control-Allow-Credentials', true);
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
app.use('/history', historyRouter);






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
http.listen(9001, () => {
  console.log('Socket io on port 9001');
});

module.exports = app;
