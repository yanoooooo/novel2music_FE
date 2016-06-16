var express = require('express');
var router = express.Router();

var conf = require('config');
var env = {};
env.API_HOST = conf.API_HOST;
env.PORT = conf.PORT;

/* questionnaire */
router.get('/explain', function(req, res, next) {
    //console.log(req.session.user.name);
    if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('questionnaire/explain', { title: 'アンケート概要', user: req.session.user.name, api_host: env.API_HOST, port: env.PORT });
});

router.get('/novel/:id', function(req, res, next) {
    //console.log(req.session.user.name);
    if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('questionnaire/novel', { title: '小説', user: req.session.user.name, id: req.params.id, api_host: env.API_HOST, port: env.PORT });
});

router.get('/term/:id', function(req, res, next) {
    //console.log(req.session.user.name);
    if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('questionnaire/term', { title: '単語', user: req.session.user.name, id: req.params.id, api_host: env.API_HOST, port: env.PORT });
});

module.exports = router;
