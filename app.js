var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var dragonball = require('./routes/dragonball');
var tokbox = require('./routes/tokbox');

var app = express();
var mongoose = require('mongoose');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://vivek:vivek@skillquest-shard-00-00-7o6mc.mongodb.net:27017,skillquest-shard-00-01-7o6mc.mongodb.net:27017,skillquest-shard-00-02-7o6mc.mongodb.net:27017/test?ssl=true&replicaSet=SkillQuest-shard-0&authSource=admin');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', index);
app.use('/users', users);
app.use('/dragonball', dragonball);
app.use('/tokbox', tokbox);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
