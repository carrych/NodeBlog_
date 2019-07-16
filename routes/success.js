let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('success', {title: 'some title', msg: 'some msg', items: 'some data'});
});

module.exports = router;
