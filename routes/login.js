var express = require('express');
var router = express.Router();
const passport = require('passport');
const Msgs = require('../handlers/Msgs');

/* GET login page. */
router.get('/', (req, res) => {
    res.render('login');
});

/* Log in */
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

/* Log out */
router.get('/logout', (req, res) => {
    console.log('LogOut');
    req.logout();
    req.flash('success_msg', Msgs.Log('out'));
    res.redirect('/login');
});

module.exports = router;
