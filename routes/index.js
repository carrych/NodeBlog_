const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../configs/auth.config');

/* GET start page. */
router.get('/', (req, res) => {
    if (req.user) {
        const {role, name} = req.user;
        if (role === 'admin')
            res.render('index', {isAdmin: true, role: true, name: name});
        else res.render('index', {isAdmin: false, role: true, name: name});
    }
    else res.render('index');
});

module.exports = router;
