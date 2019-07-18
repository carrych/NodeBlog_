const User = require('../models/user.model');
const mongoose = require('mongoose');

class UserHandler {

//if we have img in req.body - create user with this img else use default img

    async CreateUser(in_request) {

        const {username, password, email, role, avatar} = in_request.body;

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
        const {newUserName, newPassword, newEmail, newRole, newAvatar} = in_request.body;

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
