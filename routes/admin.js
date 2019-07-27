let express = require('express');
let router = express.Router();
const CollectionsHandler = require('../handlers/CollectionsHandler');
const Category = require('../models/category.model');
const Msgs = require('../handlers/Msgs');
const {ensureAuthenticated} = require('../configs/auth.config');

/* GET admin page. */
router.get('/', ensureAuthenticated, (req, res) => {

    if (req.user) {
        const {role, name} = req.user;
        if (role === 'admin')
            CollectionsHandler.FindAll(Category)
                .then((temp) => {
                    res.render('admin', {items: temp, isAdmin: true, role: true, name: name});
                })
                .catch(err => console.log(err));
        else {
            res.flash('error_msg', Msgs.Admin());
            res.render('login');
        }
    }
});

module.exports = router;
