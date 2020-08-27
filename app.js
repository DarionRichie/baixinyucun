var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var room = require('./routes/room.js');
var coupon = require('./routes/coupon.js');
var order = require('./routes/order.js');
var login = require('./routes/login.js');
var oAuth = require('./middlewares/oAuth.js');
var event = require('./routes/event.js');
var orderForm = require('./routes/orderForm');
var websocket = require('./utils/websocket');
var app = express();
app.all('*', function(req, res, next) {
  //设为指定的域
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', '*');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Expose-Headers','*');
  res.header("X-Powered-By", ' 3.2.1');
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api/user',login);
app.use(oAuth);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/room',room);
app.use('/api/order',order);
app.use('/api/coupons',coupon);
app.use('/api/event',event);
app.use('/api/orderForm',orderForm);
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
