var express = require('express');
var router = express.Router();
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const PostHandler = require('../handlers/PostHandler');

/* GET single-post. */
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const {
        category: {
            category
        }
        , mainimage
        , title,
        author: {
            username: authorName,
            mainimage: authorAvatar
        },
        postContent
    } = await PostHandler.PostWithFullInfo(id);

    res.render('single-post', {
        category,
        mainimage,
        title,
        postContent,
        authorName,
        authorAvatar
    });
});

module.exports = router;
