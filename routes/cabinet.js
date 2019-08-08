var express = require('express');
var router = express.Router();
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Category = require('../models/category.model');
const Msgs = require('../handlers/Msgs');
const assert = require('assert');
const {ensureAuthenticated} = require('../configs/auth.config');

/* GET user cabinet. */
router.get('/', ensureAuthenticated, async (req, res) => {

    const {_id, username: name, email, mainimage: avatar, created} = req.user;

    const posts = await Post.find({author: _id});
    const items = await Category.find();

    res.render('cabinet', {
        name,
        avatar,
        email,
        created,
        posts,
        items
    })
});

module.exports = router;
