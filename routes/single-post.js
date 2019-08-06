var express = require('express');
var router = express.Router();
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Category = require('../models/category.model');
const PostHandler = require('../handlers/PostHandler');
const CommentHandler = require('../handlers/CommentHandler');
const Msgs = require('../handlers/Msgs');

/* GET single-post. */
router.get('/:id', async (req, res) => {

    const {id} = req.params;
    let role = false, name ='';
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

    if (req.user) {
        role = true;
        name = req.user.username;
    }

    Category.find()
        .then((temp) => {
            res.render('single-post', {
                items: temp,
                category,
                mainimage,
                title,
                postContent,
                authorName,
                authorAvatar,
                id,
                role,
                name
            });
        })
        .catch(err => console.log(err));

});

/* POST comment. */
router.post('/add-comment/:id', (req, res) => {

    const {id} = req.params;

    if(req.body.guestName)
        req.checkBody('guestName', Msgs.Empty('Comment')).notEmpty();

    req.checkBody('comment', Msgs.Empty('Comment')).notEmpty();
    req.checkBody('comment', 'Comment must be between 5-1000 characters long.').len(5, 1000);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        res.redirect(`/single-post/${id}`);
    }
    else {
        CommentHandler.CreateComment(req)
            .then(newComment => {
                newComment.save();
            })
            .catch(err => console.log(err));
        req.flash('success_msg', Msgs.Success());
        res.redirect(`/single-post/${id}`);
    }
});

/* GET comments for single-post. */
router.get('/comments/:id', async (req, res) => {

    const {id} = req.params;

    const comments = await CommentHandler.AllCommentsForPost(id);

    if (!comments) res.status(404).json({error: Msgs.Fail()});

    res.status(200).json({comments});
    res.status(200);
});

module.exports = router;
