const User = require('../models/user.model');
const mongoose = require('mongoose');
const multer = require('multer');
const {storageConfig, fileFilter} = require('../configs/multer.config');

class UserHandler {

//if we have img in req.body - create user with this img else use default img

    async CreateUser(in_request) {
        console.log('we in CreateUser');
        const username = in_request.body.username;
        const password = in_request.body.password;
        const email = in_request.body.email;
        const role = in_request.body.role;
        const avatar = in_request.file.filename;

        let newUser = new User({
            _id: mongoose.mongo.ObjectId(),
            username: username,
            email: email,
            password: password,
            role: role
        });

        if (avatar)
            newUser.mainimage = avatar;

        return newUser;
    }

// check fields of req.body and return tempUser for update

    async CheckUpdate(in_request) {
        const tempUser = {};

        const newUserName = in_request.body.newUserName;
        const newPassword = in_request.body.newPassword;
        const newEmail = in_request.body.newEmail;
        const newRole = in_request.body.newRole;
        const newAvatar = in_request.file.filename;

        if (newUserName) {
            tempUser.username = newUserName;
        }

        if (newPassword) {
            tempUser.password = newPassword;
        }

        if (newEmail) {
            tempUser.email = newEmail;
        }

        if (newRole) {
            tempUser.role = newRole;
        }

        if (newAvatar) {
            tempUser.mainimage = newAvatar;
        }

        return tempUser;
    }
}

module.exports = new UserHandler;
