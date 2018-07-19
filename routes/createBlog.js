var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var fs = require('fs');
var createError = require('http-errors');

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
  //serving a page to write a blog.
  res.render('createBlog', { title: 'Express', loginFailureMessage: false});
});

router.post('/', function(req, res, next) {
    if(req.session.loggedIn){
      //accept data only if client is logged in.
      var mediaType = path.extname(req.file.originalname);
      var mediaName = req.file.originalname;
      var mediaSize = req.file.size;

      fs.readFile(req.file.path, function(err, mediaContent){
        if(mediaSize > 600000){
          res.end('Image is too large(Accepted image size is less than 600000 bytes).');
        }else{
          connection.query("INSERT INTO medias(media_nm, media_content, media_type, media_size) VALUES(?, ?, ?, ?);", [mediaName, mediaContent, mediaType, mediaSize], function(err, result, fields){
            if(err){
              next(createError("Error while storing a blog."));
            }
            connection.query("INSERT INTO blogs(created_by, start_img, content, title) VALUES(?, ?, ?, ?);", [req.session.userName, result.insertId, req.body.content, req.body.title]);
          });
        }
      });
    }
    res.render('createBlog', { title: 'Blogger', loginFailureMessage: false});
});

module.exports = router;
