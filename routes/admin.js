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
const ErrorMsg = require('../handlers/ErrorMsg');


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

    if (!addCategory) {
        res.render('success', {title: 'Result', msg: 'Please pass correct data.'});
    }
    else {
        Category
            .findOne({category: addCategory})
            .then((category) => {
                // if it new category, we created it in database else send msg to user that such category exist
                if (!category) {
                    try {
                        const newCategory = new Category({
                            _id: mongoose.mongo.ObjectId(),
                            category: addCategory
                        });

                        let error = newCategory.validateSync();
                        assert.equal(null, error);

                        newCategory
                            .save()
                            .then(() => {

                                CollectionsHandler.FindAllPromise(Category, ErrorMsg.CantFind('categories'))

                            })
                            .then((temp) => {
                                res.render('success', {
                                    title: 'Result',
                                    msg: 'Successfully created.',
                                    items: temp
                                });
                            })
                            .catch(err => console.log(err));
                    }
                    catch (err) {
                        CollectionsHandler.FindAll(Category)
                            .then((temp) => {
                                res.render('success', {
                                    title: 'Result',
                                    msg: `${err.expected._message}.You can enter only Latin letters`,
                                    items: temp
                                });
                            })
                            .catch(err => console.log(err));
                    }
                }
                else {
                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {title: 'Result', msg: 'Category already exist.', items: temp});
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

    if (!removeCategory) {
        res.render('success', {title: 'Result', msg: 'Please pass correct data.'});
    }
    else {
        try {
            Category.deleteOne({"category": removeCategory}, function (err, result) {
                assert.equal(null, err);
                res.render('success', {title: 'Result', msg: 'Successfully deleted.'})
            });
        }
        catch (err) {

            const {_message} = err.expected;

            CollectionsHandler.FindAll(Category)
                .then((temp) => {
                    res.render('success', {
                        title: 'Result',
                        msg: `${_message}.Delete failed.`,
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
                try {

                    UserHandler.CreateUser(req)
                        .then(newUser => {

                            let error = newUser.validateSync();
                            assert.equal(null, error);

                            newUser
                                .save()
                                .then(() => {
                                    
                                    CollectionsHandler.FindAllPromise(Category, ErrorMsg.CantFind('categories'))

                                })
                                .then((temp) => {
                                    res.render('success', {
                                        title: 'Result',
                                        msg: 'Successfully created.',
                                        items: temp
                                    });
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                }
                catch (err) {

                    const {_message} = err.expected;

                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {
                                title: 'Result',
                                msg: `${_message}.You can enter only Latin letters`,
                                items: temp
                            });
                        })
                        .catch(err => console.log(err));
                }
            }
            else {
                CollectionsHandler.FindAll(Category)
                    .then((temp) => {
                        res.render('success', {
                            title: 'Result',
                            msg: 'User already exist.',
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

    User.findOne({username: req.body.updateUserName})
        .then((user) => {
            if (!user) {
                CollectionsHandler.FindAll(Category)
                    .then((temp) => {
                        res.render('success',
                            {
                                title: 'Result',
                                msg: 'There is no such user.',
                                items: temp
                            });
                    })
                    .catch(err => console.log(err));
            }
            else {
                try {

                    const item = UserHandler.CheckUpdate(req);
                    const {updateUserName} = req.body;

                    user.updateOne({"username": updateUserName}, {$set: item}, (err) => {
                        assert.equal(null, err);
                    });

                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {
                                title: 'Result',
                                msg: `Successful updated.`,
                                items: temp
                            });
                        })
                        .catch(err => console.log(err));
                }
                catch (err) {
                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {
                                title: 'Result',
                                msg: `${err.expected._message}. Update failed.`,
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

    if (!req.body.removeUser) {
        res.render('success', {title: 'Result', msg: 'Please pass correct data.'});
    }
    else {
        try {
            User.deleteOne({"username": req.body.removeUser}, function (err, result) {
                assert.equal(null, err);
                CollectionsHandler.FindAll(Category)
                    .then((temp) => {
                        res.render('success', {
                            title: 'Result',
                            msg: `Successfully deleted`,
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
                        msg: `${err.expected._message}.Operation failed.`,
                        items: temp
                    });
                })
                .catch(err => console.log(err));
        }
    }
});
module.exports = router;
