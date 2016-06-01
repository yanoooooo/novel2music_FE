var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sign in' });
});

/* questionnaire */
router.get('/questionnaire/user', function(req, res, next) {
  res.render('questionnaire/user', { title: 'ユーザ登録' });
});

module.exports = router;
