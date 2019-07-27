var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const assert = require('assert');
const CollectionsHandler = require('../handlers/CollectionsHandler');
const Category = require('../models/category.model');
const Msgs = require('../handlers/Msgs');
const {ensureAuthenticated} = require('../configs/auth.config');

/* GET users listing. */
router.get('/', ensureAuthenticated, (req, res) => {
    if (req.user) {
        const {role, name} = req.user;
        if (role === 'admin')
            res.render('category', {isAdmin: true, role: true, name: name});
        else {
            res.flash('error_msg', Msgs.Admin());
            res.render('login');
        }
    }

});

/* POST create new category*/
router.post('/category/add', (req, res) => {

    const {addCategory} = req.body;

    req.checkBody('addCategory', Msgs.Empty('Category')).notEmpty();
    req.checkBody('addCategory', Msgs.LatinLetters()).matches(/^[a-zA-Z]+$/, 'i');

    const errors = req.validationErrors();

    if (errors) {
        CollectionsHandler.FindAll(Category)
            .then((temp) => {
                res.render('category', {
                    items: temp,
                    errors: errors,
                    isAdmin: true,
                    role: true
                });
            })
            .catch(err => console.log(err));
    }
    else {
        Category
            .findOne({category: addCategory})
            .then((category) => {
                // if it new category, we created it in database else send msg to user that such category exist
                if (!category) {
                    const newCategory = new Category({
                        _id: mongoose.mongo.ObjectId(),
                        category: addCategory
                    });

                    newCategory
                        .save()
                        .then(() => {
                            req.flash('success_msg', Msgs.Success());
                            res.redirect('/admin/category');
                        })
                        .catch(err => console.log(err));
                }
                else {

                    req.flash('error_msg', Msgs.AlreadyExist('Category'));
                    res.redirect('/admin/category');

                }
            })
            .catch(err => console.log(err));
    }
});


/* POST delete category. */
router.post('/category/delete', (req, res) => {

    const {removeCategory} = req.body;

    req.checkBody('removeCategory', Msgs.Empty('Category')).notEmpty();
    req.checkBody('removeCategory', Msgs.LatinLetters()).matches(/^[a-zA-Z]+$/, 'i');

    const errors = req.validationErrors();

    if (errors) {
        CollectionsHandler.FindAll(Category)
            .then((temp) => {
                res.render('category', {
                    items: temp,
                    errors: errors,
                    isAdmin: true,
                    role: true
                });
            })
            .catch(err => console.log(err));
    }
    else {
        try {
            Category.deleteOne({"category": removeCategory}, (err) => {
                assert.equal(null, err);

                req.flash('success_msg', Msgs.Success());
                res.redirect('/admin/category');
            });
        }
        catch (err) {

            req.flash('error_msg', Msgs.Fail());
            res.redirect('/admin/category');
        }
    }
});

module.exports = router;
