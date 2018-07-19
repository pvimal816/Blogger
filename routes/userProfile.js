var express = require('express');
var mysql = require('mysql');
var createError = require('http-errors');

var router = express.Router();

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'blogger',
  password: 'Password@123',
  database: 'blogger',
  debug: false
});

connection.connect(function (err) {
  if (err) {
    throw err;
  }
});

router.get('/', function(req, res, next) {
  if(req.query.user_name){
    connection.query("SELECT user_nm, name, email_id, profile_img FROM users WHERE user_nm=?", [req.query.user_name], function(err, result, fields){
      if(err)
        next(createError("Error while retrieving user info."));
      res.render('userProfile', { title: 'Blogger' , userInfo: result[0]});
    });
  }else if(req.session.loggedIn){
    connection.query("SELECT user_nm, name, email_id, profile_img FROM users WHERE user_nm=?", [req.session.userName], function(err, result, fields){
      if(err)
        next(createError("Error while retrieving user info."));
      res.render('userProfile', { title: 'Blogger' , userInfo: result[0]});
    });
  }else{
    res.redirect('/login');
  }
});
  
module.exports = router;
