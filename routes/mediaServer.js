var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var createError = require('http-errors');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'blogger',
    password:'Password@123',
    database: 'blogger',
    debug: false
});
connection.connect();

router.get('/', function(req, res, next){
    if(req.query.media_id){
        connection.query("SELECT media_content FROM medias WHERE media_id = ?", [req.query.media_id], function(err, result, fields){
            if(err){
                throw Error("Server error while retrieving media.");
            }else{
                if(result.length != 0){
                    res.setHeader('content-type', 'image/jpeg');
                    res.end(result[0].media_content);
                }else{
                    next(createError("Requested image not found."));
                }
            }
        });
    }else{
        throw Error("Invalid media id.");
    }
});

module.exports = router;