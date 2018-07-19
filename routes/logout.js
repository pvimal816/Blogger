var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  req.session.destroy();
  res.redirect('http://localhost:3000' + '/index');
});


module.exports = router;
