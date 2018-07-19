var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'blogger',
  password:'Password@123',
  database: 'blogger',
  debug: false
});
connection.connect();

router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM blogs where blog_id = ?;", [req.query.blog_id], function(err, result, fields){
    if(err){
      throw err;
    }

    res.render('readBlog', {blog: result[0], title: 'Blogger'});
  });
  connection.query("UPDATE blogs SET read_counts = read_counts + 1 WHERE blog_id = ?", [req.query.blog_id]);
});
  
module.exports = router;
