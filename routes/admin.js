let express = require('express');
let router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const assert = require('assert');
const CollectionsHandler = require('../handlers/CollectionsHandler');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const {storageConfig, fileFilter} = require('../configs/multer.config');
const UserHandler = require('../handlers/UserHandler');
const Msgs = require('../handlers/Msgs');
const expressValidator = require('express-validator');


/* GET admin page. */
router.get('/', function (req, res, next) {

    CollectionsHandler.FindAll(Category)
        .then((temp) => {
            res.render('admin', {items: temp});
        })
        .catch(err => console.log(err));
});

/* POST create new category*/
router.post('/category/add', function (req, res, next) {

    const {addCategory} = req.body;

    req.checkBody('addCategory', Msgs.Empty('Category')).notEmpty();
    req.checkBody('addCategory', Msgs.LatinLetters()).matches(/^[a-zA-Z]+$/, 'i');

    const errors = req.validationErrors();

    if (errors) {
        CollectionsHandler.FindAll(Category)
            .then((temp) => {
                res.render('admin', {
                    items: temp,
                    errors: errors
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

                            CollectionsHandler.FindAllPromise(Category, Msgs.CantFind('categories'))

                        })
                        .then((temp) => {
                            res.render('success', {
                                title: 'Result',
                                msg: Msgs.Success(),
                                items: temp
                            });
                        })
                        .catch(err => console.log(err));
                }
                else {
                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {title: 'Result', msg: Msgs.AlreadyExist('Category'), items: temp});
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }
});


/* POST delete category. */
router.post('/category/delete', function (req, res, next) {

    const {removeCategory} = req.body;

    req.checkBody('removeCategory', Msgs.Empty('Category')).notEmpty();
    req.checkBody('removeCategory', Msgs.LatinLetters()).matches(/^[a-zA-Z]+$/, 'i');

    const errors = req.validationErrors();

    if (errors) {
        CollectionsHandler.FindAll(Category)
            .then((temp) => {
                res.render('admin', {
                    items: temp,
                    errors: errors
                });
            })
            .catch(err => console.log(err));
    }
    else {
        try {
            Category.deleteOne({"category": removeCategory}, function (err, result) {
                assert.equal(null, err);
                res.render('success', {title: 'Result', msg: Msgs.Success()})
            });
        }
        catch (err) {

            const {_message} = err.expected;

            CollectionsHandler.FindAll(Category)
                .then((temp) => {
                    res.render('success', {
                        title: 'Result',
                        msg: `${_message}.${Msgs.Fail()}.`,
                        items: temp
                    });
                })
                .catch(err => console.log(err));
        }
    }
});

/* POST create new user.*/
router.post('/user/add', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('avatar'), function (req, res, next) {

    const {username} = req.body;

    User.findOne({username: username})
        .then((user) => {
            // if it new category, we created it in database else send msg to user that such category exist
            if (!user) {

                req.checkBody('username', Msgs.Empty('Username')).notEmpty();
                req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
                req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
                req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
                req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
                req.checkBody('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i');
                req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
                req.checkBody('role', 'Role can be only: "admin" or "user"').matches(/\buser\b|\badmin\b/, 'i');

                const errors = req.validationErrors();

                if (errors) {
                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('admin', {
                                items: temp,
                                errors: errors
                            });
                        })
                        .catch(err => console.log(err));
                }
                else {
                    UserHandler.CreateUser(req)
                        .then(newUser => {

                            newUser
                                .save()
                                .then(() => {

                                    CollectionsHandler.FindAllPromise(Category, Msgs.CantFind('categories'))

                                })
                                .then((temp) => {
                                    res.render('success', {
                                        title: 'Result',
                                        msg: Msgs.Success(),
                                        items: temp
                                    });
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                }
            }
            else {
                CollectionsHandler.FindAll(Category)
                    .then((temp) => {
                        res.render('success', {
                            title: 'Result',
                            msg: Msgs.AlreadyExist('User'),
                            items: temp
                        });
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
});

/* POST update user.*/
router.post('/user/update', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('newAvatar'), function (req, res, next) {

    const {updateUserName} = req.body;

    User.findOne({username: updateUserName})
        .then((user) => {
            if (!user) {
                CollectionsHandler.FindAll(Category)
                    .then((temp) => {
                        res.render('success',
                            {
                                title: 'Result',
                                msg: Msgs.CantFind('User'),
                                items: temp
                            });
                    })
                    .catch(err => console.log(err));
            }
            else {
                try {

                    req.checkBody('newUserName', Msgs.Empty('Username')).notEmpty();
                    req.checkBody('newUserName', 'Username must be between 4-15 characters long.').len(4, 15);
                    req.checkBody('newEmail', 'The email you entered is invalid, please try again.').isEmail();
                    req.checkBody('newEmail', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
                    req.checkBody('newPassword', 'Password must be between 8-100 characters long.').len(8, 100);
                    req.checkBody('newPassword', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i');
                    req.checkBody('newUserName', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
                    req.checkBody('newRole', 'Role can be only: "admin" or "user"').matches(/\buser\b|\badmin\b/, 'i');

                    const errors = req.validationErrors();

                    if (errors) {
                        CollectionsHandler.FindAll(Category)
                            .then((temp) => {
                                res.render('admin', {
                                    items: temp,
                                    errors: errors
                                });
                            })
                            .catch(err => console.log(err));
                    }
                    else {
                        const updatedUser = UserHandler.CheckUpdate(req);

                        user.updateOne({'username': updateUserName}, {$set: updatedUser}, (err) => {
                            //check formats of img/avatar(formats showed in file multer.config.js (other err's we checked with checkBody))

                            assert.equal(null, err);

                        });

                        CollectionsHandler.FindAll(Category)
                            .then((temp) => {
                                res.render('success', {
                                    title: 'Result',
                                    msg: Msgs.Success(),
                                    items: temp
                                });
                            })
                            .catch(err => console.log(err));
                    }
                }
                catch (err) {

                    const {_message} = err.expected;

                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {
                                title: 'Result',
                                msg: `${_message}. ${Msgs.Fail()}.`,
                                items: temp
                            });
                        })
                        .catch(err => console.log(err));
                }
            }
        })
        .catch(err => console.log(err));
});


/* POST delete user. */
router.post('/user/delete', function (req, res, next) {

    const {removeUser} = req.body;

    req.checkBody('removeUser', Msgs.Empty('Username')).notEmpty();
    req.checkBody('removeUser', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('removeUser', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors = req.validationErrors();

    if (errors) {
        CollectionsHandler.FindAll(Category)
            .then((temp) => {
                res.render('admin', {
                    items: temp,
                    errors: errors
                });
            })
            .catch(err => console.log(err));
    }
    else {
        try {
            User.deleteOne({'username': removeUser}, function (err, result) {
                assert.equal(null, err);
                CollectionsHandler.FindAll(Category)
                    .then((temp) => {
                        res.render('success', {
                            title: 'Result',
                            msg: Msgs.Success(),
                            items: temp
                        });
                    })
                    .catch(err => console.log(err));
            });
        }
        catch (err) {
            CollectionsHandler.FindAll(Category)
                .then((temp) => {
                    res.render('success', {
                        title: 'Result',
                        msg: `${err.expected._message}.${Msgs.Fail()}.`,
                        items: temp
                    });
                })
                .catch(err => console.log(err));
        }
    }
});

module.exports = router;
