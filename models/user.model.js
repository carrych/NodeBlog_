const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        username: {
            type: String,
            unique: true,
            require: true
        },
        email: {
            type: String,
            require: true,
            match: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
        },
        password: {
            type: String,
            require: true
        },
        role: {
            type: String,
            required: true
        },
        mainimage: {
            type: String,
            default: '/images/default/defaultAvatar.png',
            required: false
        },
        created: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: 'users'
    });

module.exports = mongoose.model('User', UserSchema);