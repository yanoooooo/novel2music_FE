var express = require('express');
var router = express.Router();

/* questionnaire */
router.get('/explain', function(req, res, next) {
    console.log(req.session.user.name);
    if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('questionnaire/explain', { title: 'アンケート概要', user: req.session.user.name });
});

router.get('/novel/:id', function(req, res, next) {
    console.log(req.session.user.name);
    if(req.session.user.name === null) req.session.user.name = "unknown";
    res.render('questionnaire/novel', { title: '小説', user: req.session.user.name, id: req.params.id });
});

module.exports = router;