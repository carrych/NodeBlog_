const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Msgs = require('../handlers/Msgs');

// Our User model
const User = require('../models/user.model');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

            // Try to find user with such email
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: Msgs.NotRegistred('Email') });
                }

                // Compare passwords
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: Msgs.IncorrectData('Password') });
                    }
                });
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
