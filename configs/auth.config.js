const Msgs = require('../handlers/Msgs');

module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        req.flash('error_msg', Msgs.Login());
        res.redirect('/login');
    },
};
