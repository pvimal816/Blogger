var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var login = require('./routes/login');
var signUP = require('./routes/signUp');
var readBlog = require('./routes/readBlog');
var createBlog = require('./routes/createBlog');
var userProfile = require('./routes/userProfile');
var logout = require('./routes/logout');
var mediaServer = require('./routes/mediaServer');
var upload = require('multer')({dest: './uploads'});
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, config.views));
app.set('view engine', config.viewEngine);

////setting up the necessary inbuilt routes

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({secret: config.sessionKey, cookie:{maxAge: config.sessionTimeOut}}));
app.use(express.static(path.join(__dirname, config.publicDir)));

//setting up the routes
app.use(function(req, res, next){
  //maintaining if a client login state
  res.locals.loggedIn = req.session.hasOwnProperty('loggedIn'); 
  next();
});
app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/createBlog', upload.single('image'), createBlog);
app.use('/login', login);
app.use('/media', mediaServer);
app.use('/signUp', upload.single('profile_image'), signUP);
app.use('/readBlog', readBlog);
app.use('/userProfile', userProfile);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.loggedIn = req.session.hasOwnProperty('loggedIn');
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Blogger'
  });
});

module.exports = app;