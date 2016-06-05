var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sign in' });
});

router.post('/', function(req, res, next) {
    if(req.body.name) {
        //console.dir(req.body);
        req.session.user = {name: req.body.name};
        res.redirect('/questionnaire/explain');
    } else {
        res.render('index', {title: 'Sign in'});
    }
});

router.get('/user', function(req, res, next) {
    //console.log(req.session.user);
    //if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('questionnaire/user', { title: 'ユーザ登録'});
});

module.exports = router;
