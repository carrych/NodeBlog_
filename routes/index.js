const express = require('express');
const router = express.Router();
const Msgs = require('../handlers/Msgs');
const multer = require('multer');
const {storageConfig, fileFilter} = require('../configs/multer.config');
const CollectionsHandler = require('../handlers/CollectionsHandler');
const Category = require('../models/category.model');
const Post = require('../models/post.model');
const PostHandler = require('../handlers/PostHandler');


/* GET start page. */
router.get('/', (req, res) => {
    CollectionsHandler.FindAll(Category)
        .then((temp) => {
            if (req.user) {
                const {role, username} = req.user;
                if (role === 'admin')
                    res.render('index', {isAdmin: true, role: true, name: username, items: temp});
                else res.render('index', {isAdmin: false, role: true, name: username, items: temp});
            }
            else {
                res.render('index', {warning_msg: Msgs.Login(), items: temp});
            }
        })
        .catch(err => console.log(err));
});

/* POST Create new post. */

router.post('/add-new-post', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('mainimage'), (req, res) => {

    const {title} = req.body;
    const {username} = req.user;

    Post.findOne({title: title})
        .then((post) => {
            // if this post have new title, we created new post else such post already exist
            if (!post) {

                req.checkBody('title', Msgs.Empty('Title')).notEmpty();
                req.checkBody('title', 'Title must be between 10-60 characters long.').len(10, 60);
                req.checkBody('title', 'Title can contain letters, numbers and punctuation marks.').matches(/^[A-Za-z0-9.!\s(),:;?-]+$/, 'i');
                req.checkBody('postContent', Msgs.Empty('Post content')).notEmpty();

                const errors = req.validationErrors();

                if (errors) {
                    CollectionsHandler.FindAll(Category)
                        .then((temp) => {
                            res.render('index', {
                                items: temp,
                                errors: errors,
                                isAdmin: true,
                                role: true,
                                name: username
                            });
                        })
                        .catch(err => console.log(err));
                }
                else {
                    PostHandler.CreatePost(req)
                        .then(newPost => {
                            newPost.save()
                                .then(() => {
                                    req.flash('success_msg', Msgs.Success());
                                    res.redirect('/');
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                }
            }
        })
        .catch(err => console.log(err));
});
module.exports = router;
