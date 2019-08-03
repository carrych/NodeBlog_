var express = require('express');
var router = express.Router();
const multer = require('multer');
const assert = require('assert');
const CollectionsHandler = require('../handlers/CollectionsHandler');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const {storageConfig, fileFilter} = require('../configs/multer.config');
const UserHandler = require('../handlers/UserHandler');
const Msgs = require('../handlers/Msgs');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require('../configs/auth.config');

/* GET user forms for admin. */
router.get('/', ensureAuthenticated, (req, res) => {
    if (req.user) {
        const {role, name} = req.user;
        if (role === 'admin')
            res.render('user', {isAdmin: true, role: true, name: name});
        else {
            res.render('login', {error_msg: Msgs.Admin()});
        }
    }
});

/* POST create new user.*/
router.post('/add', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('avatar'), (req, res) => {

    const {username} = req.body;
    const {name} = req.user;

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
                            res.render('user', {
                                name: name,
                                items: temp,
                                errors: errors,
                                isAdmin: true,
                                role: true
                            })
                            ;
                        })
                        .catch(err => console.log(err));
                }
                else {
                    UserHandler.CreateUser(req)
                        .then(newUser => {

                            //hash pass
                            bcrypt.genSalt(10,
                                (err, salt) => {
                                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                                        if (err) throw err;
                                        //set pass to hashed
                                        newUser.password = hash;
                                        console.log(newUser);
                                        newUser
                                            .save()
                                            .then(() => {
                                                req.flash('success_msg', Msgs.Success());
                                                res.redirect('/admin/user');
                                            })
                                            .catch(err => console.log(err));
                                    });
                                });
                        })
                        .catch(err => console.log(err));
                }
            }
            else {

                req.flash('error_msg', Msgs.AlreadyExist('User'));
                res.redirect('/admin/user');
            }
        })
        .catch(err => console.log(err));
});

/* POST update user.*/
router.post('/update', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('newAvatar'), (req, res) => {

    const {updateUserName} = req.body;
    const {name} = req.user;

    User.findOne({username: updateUserName})
        .then((user) => {
            if (!user) {

                res.flash('error_msg', Msgs.CantFind('User'));
                res.redirect('/admin/user');
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
                                res.render('user', {
                                    name: name,
                                    items: temp,
                                    errors: errors,
                                    isAdmin: true,
                                    role: true
                                })
                            })
                            .catch(err => console.log(err));
                    }
                    else {

                        const updatedUser = UserHandler.CheckUpdate(req);

                        if (updatedUser.newPassword) {
                            bcrypt.genSalt(10,
                                (err, salt) => {
                                    bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                                        if (err) throw err;
                                        //set pass to hashed
                                        updatedUser.password = hash;
                                        //update user
                                        user.updateOne({'username': updateUserName}, {$set: updatedUser}, (err) => {
                                            //check formats of img/avatar(formats showed in file multer.config.js (other err's we checked with checkBody))
                                            assert.equal(null, err);
                                        });
                                    });
                                });
                        }
                        else {
                            //update user
                            user.updateOne({'username': updateUserName}, {$set: updatedUser}, (err) => {
                                //check formats of img/avatar(formats showed in file multer.config.js (other err's we checked with checkBody))
                                assert.equal(null, err);
                            });
                        }

                        res.flash('success_msg', Msgs.Fail());
                        res.redirect('/admin/user');
                    }
                }
                catch (err) {

                    res.flash('error_msg', Msgs.Fail());
                    res.redirect('/admin/user');
                }
            }
        })
        .catch(err => console.log(err));
});


/* POST delete user. */
router.post('/delete', (req, res) => {

    const {removeUser} = req.body;
    const {name} = req.user;

    req.checkBody('removeUser', Msgs.Empty('Username')).notEmpty();
    req.checkBody('removeUser', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('removeUser', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors = req.validationErrors();

    if (errors) {
        CollectionsHandler.FindAll(Category)
            .then((temp) => {
                res.render('user', {
                    name: name,
                    errors: errors,
                    isAdmin: true,
                    role: true,
                    items: temp
                });
            })
            .catch(err => console.log(err));
    }
    else {
        try {
            User.deleteOne({'username': removeUser}, (err) => {

                assert.equal(null, err);

                res.flash('success_msg', Msgs.Success());
                res.redirect('/admin/user');
            });
        }
        catch (err) {

            res.flash('error_msg', Msgs.Fail());
            res.redirect('/admin/user');
        }
    }
});
module.exports = router;
