var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'blogger',
  password:'Password@123',
  database: 'blogger',
  debug: false
});

connection.connect(function(err){
  if(err){
    throw err;
  }
});

router.get('/', function(req, res) {
  if(req.session.loggedIn)
    res.redirect('/index');
  else
    res.render('login', { title: 'Express' , loggedIn: (req.session.hasOwnProperty('loggedIn')), loginFailureMessage: false});
});

router.post('/', function(req, res, next) {
  //database connection
  var query = "SELECT COUNT(user_nm) as count FROM users WHERE user_nm = ? and password = ?";
  
  connection.query(query, [req.body.user_name, req.body.password], function(err, result, field){
    if(err)
      throw err;
    
    if(result[0].count === 1){
      req.session.loggedIn = true;
      req.session.userName = req.body.user_name;
      res.redirect('/index');
    }
    else{
      res.render('login', { title: 'Express' , loggedIn: (req.session.hasOwnProperty('loggedIn')), loginFailureMessage: true});
    }
  });
});


module.exports = router;
