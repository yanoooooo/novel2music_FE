var express = require('express');
var router = express.Router();

var conf = require('config');
var env = {};
env.API_HOST = conf.API_HOST;
env.PORT = conf.PORT;

/* questionnaire */
router.get('/', function(req, res, next) {
    //console.log(req.session.user.name);
    if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('result/index', { title: 'アンケート結果', user: req.session.user.name, api_host: env.API_HOST, port: env.PORT });
});

module.exports = router;