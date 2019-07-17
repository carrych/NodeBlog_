let express = require('express');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
let router = express.Router();
const mongoose = require('mongoose');
const assert = require('assert');
const CategoriesHandler = require('../handlers/CategoriesHandler');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const {storageConfig, fileFilter} = require('../configs/multer.config');
const UserHandler = require('../handlers/UserHandler');


/* GET admin page. */
router.get('/', function (req, res, next) {

    CategoriesHandler.FindAll(Category)
        .then((temp) => {
            res.render('admin', {items: temp});
        })
        .catch(err => console.log(err));
});

/* POST create new category*/
router.post('/category/add', function (req, res, next) {

    if (!req.body.addCategory) {
        res.render('success', {title: 'Admin', msg: 'Please pass correct data.'});
    }
    else {
        Category
            .findOne({category: req.body.addCategory})
            .then((category) => {
                // if it new category, we created it in database else send msg to user that such category exist
                if (!category) {
                    try {
                        const newCategory = new Category({
                            _id: mongoose.mongo.ObjectId(),
                            category: req.body.addCategory
                        });

                        let error = newCategory.validateSync();
                        assert.equal(null, error);

                        newCategory
                            .save()
                            .then(() => {
                                return new Promise((resolve, reject) => {
                                    const res = CategoriesHandler.FindAll(Category);
                                    if (res) {
                                        resolve(res);
                                    } else {
                                        reject('Error. Can`t find all categories.');
                                    }
                                })
                            })
                            .then((temp) => {
                                res.render('success', {
                                    title: 'Admin',
                                    msg: 'Successfully created.',
                                    items: temp
                                });
                            })
                            .catch(err => console.log(err));
                    }
                    catch (err) {
                        CategoriesHandler.FindAll(Category)
                            .then((temp) => {
                                res.render('success', {
                                    title: 'Admin',
                                    msg: `${err.expected._message}.You can enter only Latin letters`,
                                    items: temp
                                });
                            })
                            .catch(err => console.log(err));
                    }
                }
                else {
                    CategoriesHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {title: 'Admin', msg: 'Category already exist.', items: temp});
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }
});


/* POST delete category. */
router.post('/category/delete', function (req, res, next) {

    if (!req.body.removeCategory) {
        res.render('success', {title: 'Admin', msg: 'Please pass correct data.'});
    }
    else {
        Category.deleteOne({"category": req.body.removeCategory}, function (err, result) {
            assert.equal(null, err);
            res.render('success', {title: 'Admin', msg: 'Successfully deleted.'})
        });
    }
});

/* POST create new category.*/
router.post('/user/add', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('avatar'), function (req, res, next) {

    User.findOne({username: req.body.username})
        .then((user) => {
            // if it new category, we created it in database else send msg to user that such category exist
            if (!user) {
                try {
                    console.log(req.file);
                    console.log(req.file.filename);
                    UserHandler.CreateUser(req)
                        .then(newUser => {
                            console.log('novuy user:', newUser);

                            let error = newUser.validateSync();
                            assert.equal(null, error);

                            newUser
                                .save()
                                .then(() => {
                                    return new Promise((resolve, reject) => {
                                        const res = CategoriesHandler.FindAll(Category);
                                        if (res) {
                                            resolve(res);
                                        } else {
                                            reject('Error. Can`t find all categories.');
                                        }
                                    });
                                })
                                .then((temp) => {
                                    res.render('success', {
                                        title: 'Admin',
                                        msg: 'Successfully created.',
                                        items: temp
                                    });
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                }
                catch (err) {
                    CategoriesHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('success', {
                                title: 'Admin',
                                msg: `${err.expected._message}.You can enter only Latin letters`,
                                items: temp
                            });
                        })
                        .catch(err => console.log(err));
                }
            }
            else {
                CategoriesHandler.FindAll(Category)
                    .then((temp) => {
                        res.render('success', {title: 'Admin', msg: 'User already exist.', items: temp});
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
});

router.post('/user/update', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('newAvatar'), function (req, res, next) {

    User.findOne({username: req.body.updateUserName})
    // Page.updateOne({"title": page.title}, {$set: item}, (err) => {
    //     assert.equal(null, err);
    //     console.log('item updated');
    // });
    // res.render('success', {title: 'Admin', msg: 'Successful updated page content.'})
        .then((user) => {
            if (!user) {
                CategoriesHandler.FindAll(Category)
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
                    console.log(req.file);
                    console.log(req.file.filename);
                    const item = UserHandler.CheckUpdate(req);

                    user.updateOne({"username": req.body.updateUserName}, {$set: item}, (err) => {
                        assert.equal(null, err);
                        console.log('item updated');
                    });

                    CategoriesHandler.FindAll(Category)
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
                    CategoriesHandler.FindAll(Category)
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
module.exports = router;
