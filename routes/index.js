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

router.get('/', function(req, res, next) {
  console.log(JSON.stringify(req.session));
  connection.query("SELECT created_by, start_img, title, posted_on, blog_id FROM blogs;", function(err, result, fields){
    res.render('index', { title: 'Blogger', blogs : result});
  });
});

module.exports = router;
