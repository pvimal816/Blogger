var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var createError = require('http-errors');
var path = require('path');

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

router.get('/', function (req, res, next) {
  if (req.session.loggedIn)
    res.redirect('/index');
  else {
    res.render('signUp', {
      title: 'Blogger'
    });
  }
});

router.post('/', function (req, res, next) {
  var mediaType = path.extname(req.file.originalname);
  var mediaName = req.file.originalname;
  var mediaSize = req.file.size;

  fs.readFile(req.file.path, function (err, mediaContent) {
    if (mediaSize > 600000) {
      res.end('Image is too large(Accepted image size is less than 600000 bytes).');
    } else {
      connection.query("INSERT INTO medias(media_nm, media_content, media_type, media_size) VALUES(?, ?, ?, ?);", [mediaName, mediaContent, mediaType, mediaSize], function (err, result, fields) {
        if (err) {
          next(createError("Error while storing a creating account."));
        }
        
        var query = "INSERT INTO users" +
        "(user_nm, password, name, email_id, profile_img)" +
        " VALUES(?, ?, ?, ?, ?);";
        
        var parameters = [req.body.user_name,
          req.body.password, req.body.name,
          req.body.email_id, result.insertId
        ];

        connection.query(query, parameters, function (err, result, fields) {
          if (err)
            next(createError(err));
          console.log(result);
          req.session.loggedIn = true;
          req.session.userName = req.body.user_name;
          res.redirect('/index');
        });
      });
    }
  });
});

module.exports = router;