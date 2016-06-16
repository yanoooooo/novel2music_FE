var express = require('express');
var router = express.Router();

var conf = require('config');
var env = {};
env.API_HOST = conf.API_HOST;
env.PORT = conf.PORT;

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(env);
    if(req.session.user) {
        res.redirect('/questionnaire/explain');
    }
    res.render('index', { title: 'Sign in', api_host: env.API_HOST, port: env.PORT});
});

router.post('/', function(req, res, next) {
    if(req.body.name) {
        //console.dir(req.body);
        req.session.user = {name: req.body.name};
        res.redirect('/questionnaire/explain');
    } else {
        res.render('index', {title: 'Sign in', api_host: env.API_HOST, port: env.PORT});
    }
});

router.get('/user', function(req, res, next) {
    //console.log(req.session.user);
    //if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('questionnaire/user', { title: 'ユーザ登録', api_host: env.API_HOST, port: env.PORT});
});

module.exports = router;
